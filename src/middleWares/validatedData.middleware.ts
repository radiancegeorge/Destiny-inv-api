import { Request } from "express";
import { validationResult as v, matchedData } from "express-validator";

const validationResult = async (req: Request) => {
  const err = v(req).array();
  if (err.length) throw { status: 400, error: err };
  return matchedData(req);
};

export default validationResult;
