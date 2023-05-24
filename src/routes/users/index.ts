import { Router } from "express";
import { me } from "../../controllers/user";
import { verifyToken } from "../../middleWares/auth.middleware";
import {
  RequestWithdrawal,
  getUserRequests,
  getUsersPackage,
  newInvestment,
  renewInvestment,
} from "../../controllers/packages";
import { couponValidity } from "../../controllers/coupons";
import {
  PackageRenewalValidation,
  RequestWithdrawalVerification,
} from "../../middleWares/validations/packages";
import { pagination } from "../../middleWares/validations";

const users = Router();

users.route("/me").get(verifyToken, me);
users
  .route("/packages")
  .post(verifyToken, couponValidity, newInvestment)
  .get(verifyToken, getUsersPackage);
users
  .route("/packages/:userPackageId/renew")
  .post(verifyToken, PackageRenewalValidation, renewInvestment);

users
  .route("/packages/:userPackageId/request-withdrawal")
  .get(verifyToken, RequestWithdrawalVerification, RequestWithdrawal);

users.get("/withdrawal-requests", verifyToken, pagination, getUserRequests);
export default users;
