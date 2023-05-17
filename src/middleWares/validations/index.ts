import { query } from "express-validator";

export const pagination = [query(["limit", "page"]).default(1).toInt().isInt()];
