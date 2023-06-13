import { body } from "express-validator";
import { models } from "../../../models";
import expressAsyncHandler from "express-async-handler";

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

export const getVendors = expressAsyncHandler(async (req, res) => {
  const vendors = await models.vendors.findAll();
  res.send(vendors);
});
