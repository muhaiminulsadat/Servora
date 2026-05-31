import otpGenerator from "otp-generator";
import User from "../models/user.model.ts";
import {AppError} from "../utils/AppError.ts";
import Otp from "../models/otp.model.ts";
import {mailTemplate} from "../templates/mail.template.ts";
import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {getRedisClient} from "../config/redis.config.ts";

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({email});

  if (!user) {
    throw new AppError("User with this email does not exist", 404);
  }

  // Generate otp

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // const newOtp = await Otp.findOneAndUpdate(
  //   {email},
  //   {otp, createdAt: new Date()},
  //   {upsert: true, new: true, setDefaultsOnInsert: true},
  // );

  // save otp in redis

  const client = getRedisClient();

  await client.set(`forgot_password_otp:${email}`, otp, {
    EX: 5 * 60,
  });

  const mailData = {
    to: email,
    subject: "Your OTP for Servora Registration",
    body: mailTemplate(user.fullName, otp),
    from: "Servora Team <muhaiminulsadat@gmail.com>",
  };

  await axios.post("http://localhost:5000/api/v1/send-mail", mailData);

  return null;
};

export const forgotPasswordVerifyOtpService = async (
  email: string,
  otp: string,
) => {
  // const latestOtp = await Otp.findOne({email}).sort({createdAt: -1});
  const latestOtp = await getRedisClient().get(`forgot_password_otp:${email}`);

  if (!latestOtp) {
    throw new AppError(
      "No OTP found for this email. Please request a new one.",
      404,
    );
  }

  if (latestOtp !== otp) {
    throw new AppError("Invalid OTP. OTP not matched", 422);
  }

  const token = crypto.randomBytes(32).toString("hex");

  const updatedUser = await User.findOneAndUpdate(
    {email},
    {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 10 * 60 * 1000,
    },
    {returnDocument: "after"},
  );

  return updatedUser;
};

export const resetPasswordService = async (password: string, token: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: {$gt: Date.now()},
  });

  if (!user) {
    throw new AppError("Session expired or invalid token", 400);
  }

  if (user.resetPasswordToken !== token) {
    throw new AppError("Invalid token", 400);
  }

  // Hash the new password with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = "";
  user.resetPasswordExpires = new Date(0);

  await user.save();

  return user;
};

export const updatePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (currentPassword === newPassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedNewPassword;

  await user.save();

  const {password, ...updatedUser} = user.toObject();

  return updatedUser;
};
