import { body, param } from "express-validator";

export const createPackageValidation = [
  body("name").notEmpty({ ignore_whitespace: true }),
  body(["investmentAmount", "returnAfterMaturity", "maturityPeriodInDays"])
    .toInt()
    .isInt(),
];

export const packageIdValidation = [
  param("id").notEmpty({ ignore_whitespace: true }),
];
