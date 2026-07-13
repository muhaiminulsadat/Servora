import express from "express";
import {
  forgotPasswordController,
  forgotPasswordVerifyOtpController,
  loginController,
  logoutController,
  passwordResetController,
  refreshTokenController,
  sendEmailController,
  signUpController,
  updatePasswordController,
} from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/send-auth-mail", sendEmailController);
router.post("/signUp", signUpController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.put("/forgot-password-verify-otp", forgotPasswordVerifyOtpController);
router.put("/reset-password", passwordResetController);
router.put("/update-password", updatePasswordController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

export default router;
