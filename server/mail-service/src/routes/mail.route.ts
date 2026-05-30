import express from "express";
import {sendMailController} from "../controllers/mail.controller.ts";

const router = express.Router();

router.post("/send-mail", sendMailController);

export default router;
