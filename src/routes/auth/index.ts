import { Router } from "express";
import {
  LoginValidation,
  createAccountValidations,
} from "../../middleWares/validations/auth";
import { UserLogin, registerUser } from "../../controllers/user";

const auth = Router();

auth.route("/register").post(createAccountValidations, registerUser);
auth.route("/login").post(LoginValidation, UserLogin);
export default auth;
