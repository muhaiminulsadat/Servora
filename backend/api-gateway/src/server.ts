import express, {type NextFunction, type Request, type Response} from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import {authMiddleware} from "./middlewares/auth.middleware.ts";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[Gateway]: ${req.method} ${req.url}`);
  next();
});

const authProxy = proxy("http://localhost:3001", {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace("/api/v1/auth", "");
  },

  proxyReqOptDecorator: (proxyReqOpts, srcReq: any) => {
    if (srcReq.user) {
      proxyReqOpts.headers["user_id"] = srcReq.user.userId;
    }

    return proxyReqOpts;
  },

  proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
    console.error("Error from the auth service: ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error from auth service",
    });
  },
});

const mailProxy = proxy("http://localhost:3002", {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace("/api/v1", "");
  },
  proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
    console.error("Error from the mail service: ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error from mail service",
    });
  },
});

const publicAuthRoutes = [
  "/send-auth-mail",
  "/signUp",
  "/login",
  "/forgot-password",
  "/forgot-password-verify-otp",
  "/reset-password",
  "/refresh-token",
  "/logout",
];

const privateAuthRoutes = ["/update-password"];

publicAuthRoutes.forEach((route) => {
  app.use(`/api/v1/auth${route}`, authProxy);
});

privateAuthRoutes.forEach((route) => {
  app.use(`/api/v1/auth${route}`, authMiddleware, authProxy);
});

app.use("/api/v1/send-mail", mailProxy);

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});
