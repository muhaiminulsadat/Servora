import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "worker";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {type: String, required: [true, "Full name is required"]},
    email: {type: String, required: [true, "Email is required"], unique: true},
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {type: String, enum: ["user", "admin", "worker"], default: "user"},
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
