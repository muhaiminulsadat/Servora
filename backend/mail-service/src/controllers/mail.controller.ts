import type {Request, Response} from "express";
import {AppError} from "../utils/AppError.ts";
import type {ApiResponse} from "../types/apiResponse.ts";
import {sendMailService} from "../services/mail.service.ts";

export interface IMailData {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export const sendMailController = async (req: Request, res: Response) => {
  try {
    const {to, subject, body, from} = req.body;

    // Validate required fields

    if (!to || !subject || !body) {
      throw new AppError(
        "Missing required fields: to, subject, and body are required",
        400,
      );
    }

    // Mail service call

    const mailInfo = await sendMailService({to, subject, body, from});

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    } as ApiResponse<null>);
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({success: false, message: error.message} as ApiResponse<null>);
    } else {
      console.error("Error sending email:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send email",
      } as ApiResponse<null>);
    }
  }
};
