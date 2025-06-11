import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {deleteMessageSchema, sendMessageSchema } from "./controller/message.validation.js";
import * as messageController from './controller/messages.js'

const router =Router();
router.get('/',auth,messageController.messageModule)
router.post('/sendMessage/:recieverId',isValid(sendMessageSchema),messageController.sendMessage)
router.delete('/deleteMessage/:id',isValid(deleteMessageSchema),auth,messageController.deleteMessage)


export default router