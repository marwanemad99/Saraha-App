import joi from "joi";

export const generalFeilds = {
  id: joi.string().min(24).max(24).required(),

  userName: joi.string().required(),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),

  cPassword: joi.string().required(),
};

export const isValid = (joiSchema) => {
  return (req, res, next) => {
    const copyReq = {
      ...req.body,
      ...req.params,
      ...req.query,
      ...req.headers
    };

    const { error } = joiSchema.validate(copyReq, { abortEarly: false });
    if (error) {
      return next(new Error(error));
    } else {
      return next();
    }
  };
};
