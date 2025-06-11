import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import  {fileUpload, fileValidation } from "../../utils/multerCloudinary.js";
import { shareProfileSchema, updatePasswordSchema, updateProfileSchema } from "./controller/user.validation.js";
import * as userController from "./controller/users.js";

const router = Router();
router.get("/profile",auth,userController.userProfile);
router.put("/updateProfile",isValid(updateProfileSchema),auth,userController.updateProfile);
router.delete("/deleteProfile",auth,userController.deleteProfile);
router.patch('/updatePassword',isValid(updatePasswordSchema),auth,userController.updatePassword)
router.get('/:id/shareProfile',isValid(shareProfileSchema),userController.shareProfile)


router.patch("/profilePic",fileUpload(fileValidation.image).single("image"),auth,userController.profilePic)
router.patch("/profileCovPic",fileUpload(fileValidation.image).array("image",4),auth,userController.profileCovPic)

export default router;
