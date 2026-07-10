import type {Request, Response} from "express";
import {AppError} from "../utils/AppError.ts";
import {registerUser} from "../services/otp.service.ts";
import type {ApiResponse} from "../types/apiResponse.type.ts";
import {
  loginService,
  logoutServiceCall,
  refreshTokenService,
  signUpService,
} from "../services/auth.service.ts";
import {
  forgotPasswordService,
  forgotPasswordVerifyOtpService,
  resetPasswordService,
  updatePasswordService,
} from "../services/password.service.ts";
import Otp from "../models/otp.model.ts";
import {getRedisClient} from "../config/redis.config.ts";

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

    const {user, refreshToken, accessToken} = await signUpService({
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

    res.cookie("refreshToken", refreshToken, options);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {user: safeUser, accessToken},
    } as ApiResponse<{user: typeof user; accessToken: string}>);
  } catch (error) {
    // =============== Error Handling =================
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;

    // ================ Validation =================
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    // ============== Rate Limiting with Redis =================

    const client = getRedisClient();
    const clientIp = req.ip;

    const redisKey = `login_attempts:${clientIp}`;

    const attempts = await client.incr(redisKey);

    if (attempts === 1) {
      await client.expire(redisKey, 60);
    }

    if (attempts > 5) {
      throw new AppError(
        "Too many login attempts. Please try again after a minute.",
        429,
      );
    }

    // ============== Service Call =================
    const {user, refreshToken, accessToken} = await loginService(
      email,
      password,
    );

    const {password: _password, ...safeUser} = user;

    const options = {
      expires: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000), // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    res.cookie("refreshToken", refreshToken, options);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {user: safeUser, accessToken},
    } as ApiResponse<{user: typeof user; accessToken: string}>);
  } catch (error) {
    // =============== Error Handling =================
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const {email} = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    // ============== Service Call =================
    const otpDoc = await forgotPasswordService(email);

    res.status(201).json({
      success: true,
      message: "OTP sent to email for password reset",
    } as ApiResponse<null>);
  } catch (error) {
    // =============== Error Handling =================
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};

export const forgotPasswordVerifyOtpController = async (
  req: Request,
  res: Response,
) => {
  try {
    // ================ Validation =================
    const {email, otp} = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    if (otp.length !== 4) {
      throw new AppError("Please enter a valid 4-digit OTP", 400);
    }

    // ============== Service Call =================
    const updatedUser = await forgotPasswordVerifyOtpService(email, otp);

    console.log("Updated user after OTP verification:", updatedUser);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: updatedUser,
    } as ApiResponse<typeof updatedUser>);
  } catch (error) {
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};

export const passwordResetController = async (req: Request, res: Response) => {
  const {token, password} = req.body;

  // ================ Validation =================
  if (!password) {
    throw new AppError("Token and new password are required", 400);
  }

  if (!token) {
    throw new AppError("Something went wrong during fetching token", 400);
  }

  // ============== Service Call =================

  const updatedUser = await resetPasswordService(password, token);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    data: updatedUser,
  } as ApiResponse<typeof updatedUser>);
};

export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    const {currentPassword, newPassword} = req.body;

    const userId = req.headers["user_id"] as string;

    // Validations

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }
    if (newPassword.length < 6) {
      throw new AppError(
        "New password must be at least 6 characters long",
        400,
      );
    }
    // ============= Service Call =================

    const updatedUser = await updatePasswordService(
      userId,
      currentPassword,
      newPassword,
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: updatedUser,
    } as ApiResponse<typeof updatedUser>);
  } catch (error) {
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not found", 401);
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await refreshTokenService({refreshToken});

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Refresh token generated successfully",
      data: {user: user, accessToken: accessToken},
    } as ApiResponse<{user: typeof user; accessToken: string}>);

    console.log("Refresh token:", refreshToken);
  } catch (error) {
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not found", 401);
    }

    const {message} = await logoutServiceCall({refreshToken});

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};
