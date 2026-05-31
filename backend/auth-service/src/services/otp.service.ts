import Otp, {type IOtp} from "../models/otp.model.ts";
import User from "../models/user.model.ts";
import {AppError} from "../utils/AppError.ts";
import otp from "otp-generator";
import axios from "axios";
import {mailTemplate} from "../templates/mail.template.ts";
import {getRedisClient} from "../config/redis.config.ts";

interface IUserData {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "worker";
}

export const registerUser = async (userData: IUserData) => {
  const {email, password, fullName, role} = userData;

  const isUserExists = await User.findOne({email});

  if (isUserExists) {
    throw new AppError("User with this email already exists", 409);
  }

  const newOtp = otp.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
  });

  //   ------- Save OTP to DB for later verification -------

  // const otpDoc = await Otp.findOneAndUpdate(
  //   {email},
  //   {otp: newOtp, createdAt: new Date()},
  //   {upsert: true, new: true, setDefaultsOnInsert: true},
  // );

  //   ------- Save OTP to redis for later verification -------
  const client = getRedisClient();

  const otpDoc = await client.set(`signup_otp:${email}`, newOtp, {
    EX: 5 * 60,
  });

  //   ------- Send OTP via email -------

  const mailData = {
    to: email,
    subject: "Your OTP for Servora Registration",
    body: mailTemplate(fullName, newOtp),
    from: "Servora Team <muhaiminulsadat@gmail.com>",
  };

  const response = await axios.post(
    "http://localhost:5000/api/v1/send-mail",
    mailData,
  );

  console.log(response.data);
};
