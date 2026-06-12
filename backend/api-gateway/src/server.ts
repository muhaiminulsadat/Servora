import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import {authMiddleware} from "./middlewares/auth.middleware.ts";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

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
});

const publicAuthRoutes = [
  "/sendMail",
  "/signUp",
  "/login",
  "/forgot-password",
  "/forgot-password-verify-otp",
  "/reset-password",
];

const privateAuthRoutes = ["/update-password"];

publicAuthRoutes.forEach((route) => {
  app.use(`/api/v1/auth${route}`, authProxy);
});

privateAuthRoutes.forEach((route) => {
  app.use(`/api/v1/auth${route}`, authMiddleware, authProxy);
});

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});

