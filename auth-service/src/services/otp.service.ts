import Otp, {type IOtp} from "../models/otp.model.ts";
import User from "../models/user.model.ts";
import {AppError} from "../utils/AppError.ts";
import otp from "otp-generator";
import axios from "axios";
import {mailTemplate} from "../templates/mail.template.ts";

interface IUserData {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "worker";
}

export const registerUser = async (userData: IUserData): Promise<IOtp> => {
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

  const otpDoc = await Otp.create({
    email,
    otp: newOtp,
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

  return otpDoc;
};
