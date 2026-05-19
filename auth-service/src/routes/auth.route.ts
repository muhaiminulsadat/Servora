import express from "express";
import {
  sendEmailController,
  signUpController,
  testController,
} from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/sendMail", sendEmailController);
router.post("/signUp", signUpController);
router.get("/test", testController);

export default router;
