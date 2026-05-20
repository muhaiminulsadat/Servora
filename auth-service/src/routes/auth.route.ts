import express from "express";
import {
  forgotPasswordController,
  loginController,
  sendEmailController,
  signUpController,
  testController,
} from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/sendMail", sendEmailController);
router.post("/signUp", signUpController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

router.get("/test", testController);

export default router;
