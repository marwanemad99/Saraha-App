import userModel from "../../../../DB/models/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { compare, hash } from "../../../utils/Hash&Compare.js";

//profile info
export const userProfile = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  return res.json({ message: "Done", user });
};

//update profile

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const hashPassword = hash({ plaintext: password });

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { userName, email, password: hashPassword },
    { new: true }
  );
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "User updated successfully", user });
  }
});

//delete Profile
export const deleteProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "User deleted successfully" });
  }
});

//update Password

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user._id);
  const match = compare({ plaintext: oldPassword, hashValue: user.password });

  if (!match) {
    return next(new Error("In-valid old password", { cause: 400 }));
  } else {
    const hashPassword = hash({ plaintext: newPassword });
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  }
});

//share Profile
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel
    .findById(id)
    .select("userName email gender status");
  return user
    ? res.status(200).json({ message: "Success", user })
    : next(new Error("In-valid ID account", { cause: 404 }));
});



//upload profile Picture cloud
export const profilePic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("file is required", { cause: 400 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `user/${req.user._id}/profile` }
  );
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    profileImage: secure_url,
    profileImageId: public_id,
  });
  await cloudinary.uploader.destroy(user.profileImageId);
  return res.json({ message: "Done", file: user });
});

//cover pic
export const profileCovPic = asyncHandler(async (req, res, next) => {
  if (!req.files.length) {
    return next(new Error("files are required", { cause: 400 }));
  }

  const coverImages = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `user/${req.user._id}/cover` }
    );
    coverImages.push({ secure_url, public_id });
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { coverImages },
    { new: true }
  );
  return res.json({ message: "Done", file: user });
});
