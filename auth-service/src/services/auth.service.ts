import Otp from "../models/otp.model.ts";
import User from "../models/user.model.ts";
import {AppError} from "../utils/AppError.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface ISignUpData {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "worker";
  otp: string;
}

export const signUpService = async (signUpData: ISignUpData) => {
  try {
    const {fullName, email, password, role, otp} = signUpData;

    const latestOtp = await Otp.findOne({email}).sort({createdAt: -1});

    if (!latestOtp) {
      throw new AppError(
        "No OTP found for this email. Please request a new one.",
        404,
      );
    }

    if (latestOtp.otp !== otp) {
      throw new AppError(
        "Invalid OTP. Please check the code and try again.",
        400,
      );
    }

    // Hash Password

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    const payload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new AppError(
        "JWT secret is not defined in environment variables",
        500,
      );
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1y",
    });

    return {user: newUser.toObject(), token};
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(error.message || "An unexpected error occurred", 500);
  }
};

export const loginService = async (email: string, password: string) => {
  try {
    const user = await User.findOne({email}).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const payload = {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new AppError(
        "JWT secret is not defined in environment variables",
        500,
      );
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1y",
    });

    return {user: user.toObject(), token};
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(error.message || "An unexpected error occurred", 500);
  }
};

