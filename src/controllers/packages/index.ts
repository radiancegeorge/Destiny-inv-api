import expressAsyncHandler from "express-async-handler";
import validationResult from "../../middleWares/validatedData.middleware";
import db, { models } from "../../../models";

export const getPackages = expressAsyncHandler(async (req, res) => {
  const { limit, page } = await validationResult(req);
  const offset = (page - 1) * limit;
  const { count, rows } = await models.packages.findAndCountAll({
    limit,
    offset,
  });
  const totalPages = Math.ceil(count / limit);
  res.send({
    total: count,
    currentPage: page,
    totalPages,
    results: rows,
  });
});

export const getSinglePackage = expressAsyncHandler(async (req, res) => {
  const { id } = await validationResult(req);
  const val = await models.packages.findOne({
    where: {
      id,
    },
  });
  if (!val) {
    throw { statusCode: 404, message: "package not found" };
  }
  res.send(val);
});

export const getUsersPackage = expressAsyncHandler(async (req, res) => {
  const { id } = (req as any).user;
  const packages = await models.userPackages.findAll({
    where: {
      userId: id,
      // isWithdrawn: false,
    },
  });

  res.send(packages);
});

export const newInvestment = expressAsyncHandler(async (req, res) => {
  const { couponCode } = await validationResult(req);
  const { id } = (req as any).user;
  const transaction = await db.sequelize.transaction();
  try {
    const coupon = await models.coupons.findOne({
      where: {
        code: couponCode,
        isRedeemed: false,
      },
      include: {
        model: models.packages,
      },
      transaction,
    });

    const { package: pkg }: { package?: any } = coupon!.dataValues;
    const date = new Date();
    date.setDate(date.getDate() + pkg.maturityPeriodInDays);
    //create package
    const newUserPkg = await models.userPackages.create(
      {
        couponId: coupon!.dataValues.id,
        maturityDate: date as any,
        userId: id,
        packageId: pkg.id,
        amount: pkg.investmentAmount,
      },
      { transaction }
    );
    // console.log(newUserPkg);
    await coupon?.update({ isRedeemed: true }, { transaction });
    //create transactions
    const newTransaction = await models.transactions.create(
      {
        amount: pkg.investmentAmount,
        userPackageId: newUserPkg.dataValues.id,
        userId: id,
      },
      { transaction }
    );

    res.send(newTransaction);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw { statusCode: 400, error: err };
  }
});

export const renewInvestment = expressAsyncHandler(async (req, res) => {
  const { couponCode, userPackageId } = await validationResult(req);
  const { id } = (req as any).user;
  const t = await db.sequelize.transaction();
  try {
    const coupon = await models.coupons.findOne({
      where: {
        code: couponCode,
        isRedeemed: false,
      },
      include: {
        model: models.packages,
      },
      transaction: t,
    });
    const userPackage = await models.userPackages.findOne({
      where: {
        id: userPackageId,
      },
      include: {
        model: models.packages,
      },
    });
    //check if package has a renewed status and disallow
    if (userPackage?.dataValues.status === "renewed")
      throw { statusCode: 403, message: "Package was recently renewed!" };

    if (
      Number((coupon?.dataValues.package as any).investmentAmount) <
      Number((userPackage?.dataValues.package as any).investmentAmount)
    )
      throw {
        statusCode: 403,
        message:
          "Renewal can only be the same or greater than previous package!",
      };
    //might need to add validations down here to control time of renewal
    //create transaction
    const newTransaction = await models.transactions.create(
      {
        amount: (coupon?.dataValues.package as any).investmentAmount,
        userPackageId: userPackage?.dataValues.id as string,
        userId: userPackage?.dataValues.userId,
      },
      { transaction: t }
    );
    //update user package
    await userPackage?.update(
      {
        status: "renewed",
        couponId: coupon?.dataValues.id,
        packageId: (coupon?.dataValues.package as any).id,
        amount: (coupon?.dataValues.package as any).investmentAmount,
      },
      { transaction: t }
    );
    //update coupon
    await coupon!.update({ isRedeemed: true }, { transaction: t });

    res.send(newTransaction);
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw { statusCode: 400, error };
  }
});
