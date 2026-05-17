import type {Request, Response} from "express";
import {AppError} from "../utils/AppError.ts";
import {registerUser} from "../services/auth.service.ts";
import type {ApiResponse} from "../types/apiResponse.type.ts";

export const sendEmailController = async (req: Request, res: Response) => {
  try {
    const {fullName, email, password, role} = req.body;

    // ================ Validation =================
    if (!fullName || !email || !password) {
      throw new AppError("Full name, email, and password are required", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters long", 400);
    }

    // ============== Service Call =================

    const newOtp = await registerUser({fullName, email, password, role});

    res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
      data: newOtp,
    } as ApiResponse<typeof newOtp>);
  } catch (error: any) {
    // =============== Error Handling =================
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "An unexpected error occurred",
    });
  }
};

export const testController = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint is working!",
  });
};
