import joi from "joi";
import { generalFeilds } from "../../../middleware/validation.middleware.js";

export const signupSchema = joi
  .object({
    userName: joi.string().required(),

    email: generalFeilds.email,

    password: generalFeilds.password,
  })
  .required().unknown(true);

export const loginSchema = joi
  .object({
    userName: generalFeilds.userName,

    email: generalFeilds.email,

    password: generalFeilds.password,
  })
  .required().unknown(true);
