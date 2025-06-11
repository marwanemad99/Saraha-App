import messageModel from "../../../../DB/models/messages.model.js";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//get all messages
export const messageModule = asyncHandler(async (req, res, next) => {
  const messageList = await messageModel.find({ recieverId: req.user._id });
  return res.status(201).json({ message: "Done", messageList });
});

//send messages
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { recieverId } = req.params;
  const { message } = req.body;

  const user = await userModel.findById(recieverId);
  if (!user) {
    return next(new Error("In-valid user account ID", { cause: 404 }));
  } else {
    const createMessage = await messageModel.create({
      recieverId,
      message,
    });
    return res.status(201).json({ message: "Done", createMessage });
  }
});

//delete messages
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const message = await messageModel.deleteOne({
    _id: id,
    recieverId: req.user._id,
  });
  return message.deletedCount
    ? res.status(200).json({ message: "Deleted successfully" })
    : next(new Error("message not found or invalid ID", { cause: 400 }));
});
