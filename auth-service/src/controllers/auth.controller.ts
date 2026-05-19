import type {Request, Response} from "express";
import {AppError} from "../utils/AppError.ts";
import {registerUser} from "../services/otp.service.ts";
import type {ApiResponse} from "../types/apiResponse.type.ts";
import {signUpService} from "../services/auth.service.ts";

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

export const signUpController = async (req: Request, res: Response) => {
  try {
    const {fullName, email, password, role, otp} = req.body;

    // ================ Validation =================
    if (!fullName || !email || !password || !role) {
      throw new AppError(
        "Full name, email, password, and role are required",
        400,
      );
    }

    if (!otp || otp.length !== 4) {
      throw new AppError("Please enter a valid 4-digit OTP", 400);
    }

    // ============== Service Call =================

    const {user, token} = await signUpService({
      fullName,
      email,
      password,
      role,
      otp,
    });

    const {password: _password, ...safeUser} = user;

    const options = {
      expires: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000), // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    res.cookie("token", token, options);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {user: safeUser, token},
    } as ApiResponse<{user: typeof user; token: string}>);
  } catch (error) {
    // =============== Error Handling =================
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};


