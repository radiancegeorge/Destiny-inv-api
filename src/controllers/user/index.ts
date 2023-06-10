import expressAsyncHandler from "express-async-handler";
import validationResult from "../../middleWares/validatedData.middleware";
import db, { models } from "../../../models";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { Request } from "express";
import Web3 from "web3";
import { abi } from "../../utils/abi";
import rs from "randomstring";
import sendMail from "../../utils/sendMail";
import couponTemplate from "../../templates/coupon";
export const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, couponCode, walletAddress } = await validationResult(
    req
  );
  const coupon = await models.coupons.findOne({
    where: {
      code: couponCode,
    },
    include: models.packages,
  });
  const { hashedPassword } = req as any;
  const transaction = await db.sequelize.transaction();
  try {
    //create user
    const newUser = await models.users.create(
      {
        username,
        walletAddress,
        email,
        password: hashedPassword,
      },
      { transaction }
    );
    //register with plan and transactions
    const pkg = coupon?.dataValues.package as any;
    const date = new Date();
    date.setDate(date.getDate() + pkg.maturityPeriodInDays);

    const userPkg = await pkg.addUser(newUser, {
      through: {
        couponId: coupon?.dataValues.id,
        maturityDate: date,
      },
      transaction,
    });

    await models.transactions.create(
      {
        userId: newUser.dataValues.id,
        userPackageId: userPkg[0].dataValues.id,
        amount: pkg.investmentAmount,
        packageId: pkg.id,
      },
      { transaction }
    );
    const couponForUpdate = coupon as any;
    couponForUpdate.isRedeemed = true;
    await couponForUpdate.save({ transaction });
    const token = jwt.sign(
      {
        id: newUser.dataValues.id,
        email: newUser.dataValues.email,
        username: newUser.dataValues.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30 days",
      }
    );
    res.send({
      token,
    });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw { statusCode: 400, error: err };
  }
});

export const UserLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = await validationResult(req);

  const user = await models.users.findOne({
    where: {
      [Op.or]: [{ email }, { username: email }],
    },
  });

  if (user) {
    const isUser = await bcrypt.compare(password, user.dataValues.password);
    if (isUser) {
      const token = jwt.sign(
        {
          id: user.dataValues.id,
          email: user.dataValues.email,
          username: user.dataValues.username,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "30 days",
        }
      );
      res.send({
        token,
      });
      return;
    }
  }
  throw { statusCode: 401, message: "Invalid credentials!" };
});

interface UserJwt extends Request {
  user: {
    username: string;
    id: string;
    email: string;
  };
}
export const me = expressAsyncHandler(async (req, res) => {
  const { user } = req as UserJwt;
  const data = await models.users.findOne({
    where: {
      id: user.id,
    },
    attributes: {
      exclude: ["password", "deletedAt"],
    },
  });
  res.send(data);
});

export const RequestResetPassword = expressAsyncHandler(async (req, res) => {
  const { email } = await validationResult(req);
  const user = await models.users.findOne({
    where: {
      email,
    },
  });
  if (!user) throw { statusCode: 404, message: "user not found" };

  //delete previous

  await models.requestResetPassword.destroy({
    where: {
      userId: user.dataValues.id,
    },
  });

  const newRequest = await (user as any).createRequestResetPassword();

  //send an email

  res.send(newRequest);
});

export const ResetPassword = expressAsyncHandler(async (req, res) => {
  const { id, code, password } = await validationResult(req);
  const isValid = await models.requestResetPassword.findOne({
    where: {
      id,
      code,
    },
    include: {
      model: models.users,
    },
  });
  if (!isValid) throw { statusCode: 400, message: "invalid code" };
  const encryptedPassword = await bcrypt.hash(password, 10);
  await (isValid.dataValues.user as any).update({
    password: encryptedPassword,
  });
  res.send({ message: "password reset success!" });
});

export const ChangePassword = expressAsyncHandler(async (req, res) => {
  await validationResult(req);
  const { hashedPassword } = req as any;
  const { id } = (req as any).user;
  await models.users.update({ password: hashedPassword }, { where: { id } });
  res.send();
});

export const UpdateUser = expressAsyncHandler(async (req, res) => {
  const data = await validationResult(req);
  const { id } = (req as any).user;

  await models.users.update(data, {
    where: {
      id,
    },
  });

  const user = await models.users.findOne({
    where: {
      id,
    },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
    },
  });
  res.send(user);
});

//listener
(async () => {
  const web3 = new Web3(
    "wss://green-autumn-county.bsc-testnet.discover.quiknode.pro/b0fd9cc5fabd3b1134e83db32c7c9fc40a763813/"
  );
  const contract = new web3.eth.Contract(
    abi,
    "0x852D2D737a24c1715FcA3ac3c3cC206AbE8C0224"
  );
  const payForPlanEvent = contract.events.PayForPlan();

  interface PayForPlanData {
    address: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    logIndex: number;
    removed: boolean;
    id: string;
    returnValues: {
      "0": string;
      "1": string;
      email: string;
      plan: string;
    };
    event: string;
    signature: string;
    raw: {
      data: string;
      topics: string[];
    };
  }

  payForPlanEvent
    .on("data", async (data: PayForPlanData) => {
      try {
        const values = data.returnValues;
        const email = web3.utils.hexToAscii(values.email);
        const { plan } = values;

        //find package
        const packagePaid = await models.packages.findOne({
          where: {
            contractIndex: plan,
          },
        });

        if (packagePaid) {
          const coupon = await (packagePaid as any).createCoupon({
            code: rs.generate(16),
          });

          console.log(coupon);
          //email coupon to user
        }
      } catch (err) {
        console.log(err);
        //reverse cash paid if possible
      }
    })
    .on("error", console.log);

  const payoutEvent = contract.events.Payout();
  payoutEvent.on("data", async (data: any) => {
    //handle data
    console.log(data);
  });
})();
// sendMail({
//   sender: { name: "coupon", email: "coupon@capitalcove.com.ng" },
//   htmlContent: couponTemplate(),
//   subject: "New Coupon",
//   to: [{ email: "radiancegeorge@gmail.com" }],
// }).catch(console.log);

//todo
//payout with smart contract
//vendors contact
//bulk create
//bulk tick completed transactions
//add bank details - users
