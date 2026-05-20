import otpGenerator from "otp-generator";
import User from "../models/user.model.ts";
import {AppError} from "../utils/AppError.ts";
import Otp from "../models/otp.model.ts";
import {mailTemplate} from "../templates/mail.template.ts";
import axios from "axios";

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

  const newOtp = await Otp.findOneAndUpdate(
    {email},
    {otp, createdAt: new Date()},
    {upsert: true, new: true, setDefaultsOnInsert: true},
  );

  const mailData = {
    to: email,
    subject: "Your OTP for Servora Registration",
    body: mailTemplate(user.fullName, otp),
    from: "Servora Team <muhaiminulsadat@gmail.com>",
  };

  await axios.post("http://localhost:5000/api/v1/send-mail", mailData);

  return newOtp;
};
