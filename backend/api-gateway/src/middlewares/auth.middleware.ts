import type {NextFunction, Request, Response} from "express";
import {AppError} from "../utils/AppError.ts";
import jwt from "jsonwebtoken";
import {timeStamp} from "node:console";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.accessToken || req?.body?.token;

    if (!token) {
      throw new AppError("Token not provided", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError("JWT secret not configured", 500);
    }

    const verifyToken = jwt.verify(token, jwtSecret);

    req.user = verifyToken;

    next();
  } catch (error) {
    res.status((error as any).statusCode || 500).json({
      success: false,
      message: (error as any).message || "An unexpected error occurred",
    });
  }
};


