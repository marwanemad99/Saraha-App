import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
import { compare, hash } from "../../../utils/Hash&Compare.js";
import sendEmail from "../../../utils/sendEmail.js";
import { temp } from "../../../utils/tempMail.js";

//get module
export const authModule = async (reg, res, next) => {
  return res.json({ message: "auth moduele" });
};

//signup
export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("Email already exist", { cause: 409 }));
  }

  const emailToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${emailToken}`;

  const refreshEmailToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24 * 30 * 12,
  });

  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshEmailToken}`;


  //html templete
  const html = temp(link, refreshLink);


  const info = await sendEmail({
    to: email,
    subject: "Confirmation mail",
    html,
  });
  if (!info) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }

  const hashPassword = hash({ plaintext: password });
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res.status(200).json({
    message: "User added successfully",
    user: createUser._id,
  });
});

//login
export const logIn = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ userName, email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const match = compare({ plaintext: password, hashValue: user.password });

  if (!match) {
    return next(new Error("Password incorrect", { cause: 401 }));
  }

  const token = generateToken({
    payload: {
      id: user._id,
      user_name: user.userName,
      email: user.email,
      role: user.role,
    },
  });

  user.status = "online";
  await user.save();
  return res.status(200).json({
    message: "Logged in successfully",
    authentication: token,
  });
});

//confirm Email
export const confirmEmail = async (req, res, next) => {
  const { emailToken } = req.params;

  const { email } = verifyToken({
    payload: emailToken,
    signature: process.env.EMAIL_TOKEN,
  });
  const user = await userModel.updateOne({ email }, { confirmEmail: true });
  return user.modifiedCount
    ? res.status(200).redirect("https://facebook.com/home")
    : res.status(400).send("Not register account");
};

//new confirm email
export const newConfirmEmail = async (req, res, next) => {
  const { emailToken } = req.params;

  const { email } = verifyToken({
    payload: emailToken,
    signature: process.env.EMAIL_TOKEN,
  });

  const newEmailToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newEmailToken}`;

  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${emailToken}`;

  const html = temp(link, refreshLink);

  const info = await sendEmail({
    to: email,
    subject: "Confirmation mail",
    html,
  });
  if (!info) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  return res.status(200).send("Done ,check your inbox");
};
