import mongoose from "mongoose";

export interface IOtp {
  email: string;
  otp: string;
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
  
});

const Otp = mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
