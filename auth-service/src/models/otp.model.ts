import mongoose from "mongoose";

export interface IOtp {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new mongoose.Schema<IOtp>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  otp: {
    type: String,
    required: [true, "OTP is required"],
    maxlength: [4, "OTP must be 4 digits"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const Otp = mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
