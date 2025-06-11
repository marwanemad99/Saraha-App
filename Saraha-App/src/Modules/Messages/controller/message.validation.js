import joi from "joi";
import { generalFeilds } from "../../../middleware/validation.middleware.js";

export const sendMessageSchema = joi
  .object({
    message: joi.string().min(3).max(1500).required(),
    recieverId: generalFeilds.id,
  })
  .required().unknown(true);

export const deleteMessageSchema = joi
  .object({
    id: generalFeilds.id,
    recieverId: generalFeilds.id
  })
  .required();
