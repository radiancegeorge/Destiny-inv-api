import { Router } from "express";
import {
  LoginValidation,
  RequestResetPasswordValidation,
  ResetPasswordValidation,
  createAccountValidations,
} from "../../middleWares/validations/auth";
import {
  RequestResetPassword,
  ResetPassword,
  UserLogin,
  registerUser,
} from "../../controllers/user";

const auth = Router();

auth.route("/register").post(createAccountValidations, registerUser);
auth.route("/login").post(LoginValidation, UserLogin);
auth
  .route("/request-reset-password/:email")
  .post(RequestResetPasswordValidation, RequestResetPassword);
auth
  .route("/reset-password/:id/:code")
  .post(ResetPasswordValidation, ResetPassword);
export default auth;
