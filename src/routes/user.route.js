import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  updateUserProfile,
  updateUserPicture,
  getUserProfile,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("picture"), registerUser);
router.route("/login").post(login);
// Secured Routes Starts Here
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-accessToken").post(verifyJWT, refreshAccessToken);
router.route("/update-Profile").patch(verifyJWT, updateUserProfile);
router
  .route("/update-Picture")
  .patch(upload.single("picture"), updateUserPicture);
router.route("/get-Profile").get(verifyJWT, getUserProfile);
router.route("/delete-Profile").delete(verifyJWT, deleteUser);

export default router;
