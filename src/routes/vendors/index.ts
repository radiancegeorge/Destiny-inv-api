import { Router } from "express";
import { getVendors } from "../../controllers/coupons";

const vendor = Router();

vendor.get("/", getVendors);

export default vendor;
