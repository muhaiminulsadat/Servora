import {getRedisClient} from "../config/redis.config.ts";
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

interface IRefreshToken {
  refreshToken: string;
}

interface ILogout {
  refreshToken: string;
}

export const signUpService = async (signUpData: ISignUpData) => {
  const client = getRedisClient();
  try {
    const {fullName, email, password, role, otp} = signUpData;

    // const latestOtp = await Otp.findOne({email}).sort({createdAt: -1});

    const latestOtp = await client.get(`signup_otp:${email}`);

    if (!latestOtp) {
      throw new AppError(
        "No OTP found for this email. Please request a new one.",
        404,
      );
    }

    if (latestOtp !== otp) {
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

    const jwtPayload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    // ----------- Access and Refresh Token Generation -----------

    const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

    if (!ACCESS_TOKEN_JWT_SECRET) {
      throw new AppError(
        "Access token JWT secret is not defined in environment variables",
        500,
      );
    }

    const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET;

    if (!REFRESH_TOKEN_JWT_SECRET) {
      throw new AppError(
        "Refresh token JWT secret is not defined in environment variables",
        500,
      );
    }

    const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_JWT_SECRET, {
      expiresIn: "15min",
    });

    const refreshToken = jwt.sign(jwtPayload, REFRESH_TOKEN_JWT_SECRET, {
      expiresIn: "7d",
    });

    // save refresh token in redis
    await client.set(`session:${newUser._id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    return {user: newUser.toObject(), accessToken, refreshToken};
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(error.message || "An unexpected error occurred", 500);
  }
};

export const loginService = async (email: string, password: string) => {
  const client = getRedisClient();
  try {
    const user = await User.findOne({email}).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const jwtPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    // ----------- Access and Refresh Token Generation -----------

    const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

    if (!ACCESS_TOKEN_JWT_SECRET) {
      throw new AppError(
        "Access token JWT secret is not defined in environment variables",
        500,
      );
    }

    const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET;

    if (!REFRESH_TOKEN_JWT_SECRET) {
      throw new AppError(
        "Refresh token JWT secret is not defined in environment variables",
        500,
      );
    }

    const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_JWT_SECRET, {
      expiresIn: "15min",
    });

    const refreshToken = jwt.sign(
      {userId: user._id},
      REFRESH_TOKEN_JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // save refresh token in redis
    await client.set(`session:${user._id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    return {user: user.toObject(), accessToken, refreshToken};
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(error.message || "An unexpected error occurred", 500);
  }
};

export const refreshTokenService = async (data: IRefreshToken) => {
  const refreshToken = data.refreshToken;

  const decoded: any = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_JWT_SECRET as string,
  );

  const userId = decoded.userId;

  const client = getRedisClient();

  // Check Redis session
  const storedToken = await client.get(`session:${userId}`);

  if (storedToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.ACCESS_TOKEN_JWT_SECRET as string,
    {
      expiresIn: "15min",
    },
  );

  const newRefreshToken = jwt.sign(
    {userId: user._id},
    process.env.REFRESH_TOKEN_JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  await client.set(`session:${user._id}`, newRefreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  return {user: user.toObject(), accessToken, refreshToken: newRefreshToken};
};

export const logoutServiceCall = async (data: ILogout) => {
  const client = getRedisClient();

  try {
      const refreshToken = data.refreshToken;

    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET as string,
    );

    const userId = decoded.userId;

    // Check Redis session
    const storedToken = await client.get(`session:${userId}`);

    if (storedToken !== refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Delete from Redis
    await client.del(`session:${userId}`);

    await client.set(`blacklist:${userId}`, "true", {
      EX: 15 * 60,
    });

    return {message: "User logged out successfully"};
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(error.message || "An unexpected error occurred", 500);
  }
};
