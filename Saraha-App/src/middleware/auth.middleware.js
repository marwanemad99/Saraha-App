import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Error("authorization is required"))
  }

  const decoded = jwt.verify(authorization, process.env.SIGNATURE);

  if (!decoded?.id) {
    return next(new Error("In-valid token payload"))
  }

  const authUser = await userModel.findById(decoded.id);
  if (!authUser) {
    return next(new Error("not register account"))
  }

  req.user = authUser;
  return next();
});

export default auth;
