import { Router } from "express";
import { me } from "../../controllers/user";
import { verifyToken } from "../../middleWares/auth.middleware";
import { getUsersPackage, newInvestment } from "../../controllers/packages";
import { couponValidity } from "../../controllers/coupons";

const users = Router();

users.route("/me").get(verifyToken, me);
users
  .route("/packages")
  .post(verifyToken, couponValidity, newInvestment)
  .get(verifyToken, getUsersPackage);
export default users;
