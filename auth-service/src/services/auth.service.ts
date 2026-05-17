import Otp, {type IOtp} from "../models/otp.model.ts";
import User from "../models/user.model.ts";
import {AppError} from "../utils/AppError.ts";
import otp from "otp-generator";

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

  return otpDoc;
};
