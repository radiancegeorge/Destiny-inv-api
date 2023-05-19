import { Router } from "express";
import { me } from "../../controllers/user";
import { verifyToken } from "../../middleWares/auth.middleware";
import {
  getUsersPackage,
  newInvestment,
  renewInvestment,
} from "../../controllers/packages";
import { couponValidity } from "../../controllers/coupons";
import { PackageRenewalValidation } from "../../middleWares/validations/packages";

const users = Router();

users.route("/me").get(verifyToken, me);
users
  .route("/packages")
  .post(verifyToken, couponValidity, newInvestment)
  .get(verifyToken, getUsersPackage);
users
  .route("/packages/:userPackageId/renew")
  .post(verifyToken, PackageRenewalValidation, renewInvestment);
export default users;
