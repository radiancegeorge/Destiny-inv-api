import { body, param } from "express-validator";
import { models } from "../../../models";
import Web3 from "web3";
import bcrypt from "bcrypt";

export const createAccountValidations = [
  body(["username", "email", "password", "rePassword"]).notEmpty({
    ignore_whitespace: true,
  }),

  body("password").custom((password, { req }) => {
    if (password !== req.body.rePassword)
      throw new Error("passwords must match!");
    req.hashedPassword = bcrypt.hashSync(password, 10);
    return true;
  }),
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
  body("walletAddress")
    .optional()
    .custom(async (walletAddress) => {
      if (!Web3.utils.isAddress(walletAddress))
        throw new Error("Not a wallet address!");
      if (!Web3.utils.checkAddressChecksum(walletAddress))
        throw new Error("Invalid wallet address!");
      return true;
    }),
  body("email").isEmail().normalizeEmail(),
];

export const LoginValidation = [
  body(["email", "password"]).notEmpty({ ignore_whitespace: true }),
];

export const ResetPasswordValidation = [
  param(["code", "id"]).notEmpty().withMessage("cannot be empty"),
  body("password").trim().notEmpty().withMessage("password cannot be empty"),
];

export const ChangePasswordValidation = [
  body("oldPassword")
    .notEmpty({ ignore_whitespace: true })
    .custom(async (value, { req }) => {
      const user = await models.users.findOne({
        where: { email: req.user.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const passwordMatch = bcrypt.compareSync(value, user.dataValues.password);
      if (!passwordMatch) {
        throw new Error("Old password does not match");
      }

      return true;
    })
    .withMessage("Old Password is incorrect"),
  body("newPassword")
    .notEmpty({ ignore_whitespace: true })
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      req.hashedPassword = bcrypt.hashSync(value, 10);
      return true;
    })
    .withMessage("New Password must be at least 8 characters long"),
];

export const RequestResetPasswordValidation = [
  param("email").isEmail().withMessage("please provide a valid email"),
];

export const UserUpdatesValidation = [
  body([
    "walletAddress",
    "phoneNumber",
    "bankAccountNumber",
    "bankName",
    "fullName",
  ]).optional(),
];
