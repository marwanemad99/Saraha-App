import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  signature = process.env.SIGNATURE,
} = {}) => {
  const authentication = jwt.sign(payload, signature);
  return authentication;
};

export const verifyToken = ({
  payload,
  signature = process.env.SIGNATURE,
} = {}) => {
  const decoded = jwt.verify(payload, signature);
  return decoded;
};
