import joi from "joi";
import { generalFeilds } from "../../../middleware/validation.middleware.js";

export const updateProfileSchema = joi
  .object({
    userName: joi.string().required(),

    email: generalFeilds.email,

    password: generalFeilds.password,
  })
  .required();

export const updatePasswordSchema = joi
  .object({
    oldPassword: generalFeilds.password,

    newPassword: generalFeilds.password.invalid(joi.ref("oldPassword")),

    cPassword: generalFeilds.cPassword.valid(joi.ref("newPassword")),
  })
  .required();

export const shareProfileSchema = joi
  .object({
    id: generalFeilds.id,
  })
  .required();
