import { body } from "express-validator";
import { models } from "../../../models";

export const couponValidity = [
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
