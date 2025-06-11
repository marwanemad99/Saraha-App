import { Router }from "express"
import { isValid } from "../../middleware/validation.middleware.js";
import * as authController from "../Auth/controller/auth.js"
import { loginSchema, signupSchema } from "./controller/auth.validation.js";
const router=Router();

router.get('/',authController.authModule)
router.post('/signup',isValid(signupSchema),authController.signUp)
router.get('/confirmEmail/:emailToken',authController.confirmEmail)
router.get('/newConfirmEmail/:emailToken',authController.newConfirmEmail)
router.post('/login',isValid(loginSchema),authController.logIn)

export default router