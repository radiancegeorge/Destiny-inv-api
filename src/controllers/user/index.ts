import expressAsyncHandler from "express-async-handler";
import validationResult from "../../middleWares/validatedData.middleware";
import db, { models } from "../../../models";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { Request } from "express";

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

//edit account
