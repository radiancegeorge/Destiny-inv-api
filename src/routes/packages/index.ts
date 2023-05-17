import { Router } from "express";
import { packageIdValidation } from "../../middleWares/validations/packages";
import { pagination } from "../../middleWares/validations";
import { getPackages, getSinglePackage } from "../../controllers/packages";

const packages = Router();

packages.route("/").get(pagination, getPackages);
packages.route("/:id").get(packageIdValidation, getSinglePackage);

export default packages;
