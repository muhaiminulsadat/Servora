import express from "express";
import {
  forgotPasswordController,
  forgotPasswordVerifyOtpController,
  loginController,
  passwordResetController,
  sendEmailController,
  signUpController,
} from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/sendMail", sendEmailController);
router.post("/signUp", signUpController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.put("/forgot-password-verify-otp", forgotPasswordVerifyOtpController);
router.put("/reset-password", passwordResetController);

export default router;
