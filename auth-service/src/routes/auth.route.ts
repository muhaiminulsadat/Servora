import express from "express";
import {
  sendEmailController,
  testController,
} from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/sendMail", sendEmailController);

export default router;


