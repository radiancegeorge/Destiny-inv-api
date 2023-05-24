import { body, param } from "express-validator";
import { models } from "../../../models";

export const createPackageValidation = [
  body("name").notEmpty({ ignore_whitespace: true }),
  body(["investmentAmount", "returnAfterMaturity", "maturityPeriodInDays"])
    .toInt()
    .isInt(),
];

export const packageIdValidation = [
  param("id").notEmpty({ ignore_whitespace: true }),
];

export const PackageRenewalValidation = [
  param("userPackageId")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("cannot be empty"),
  body("couponCode").custom(async (code) => {
    const couponCode = await models.coupons.findOne({
      where: {
        code,
        isRedeemed: false,
      },
    });
    if (!couponCode) throw new Error("Invalid coupon or expired!");
    return true;
  }),
];
