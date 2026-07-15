import api from "./axios";
import type {signUpPayload, loginPayload} from "../types/auth.types";

export const signUpMailSendApi = async (data: signUpPayload) => {
  const {name: fullName, email, password, role} = data;
  const response = await api.post("/auth/send-auth-mail", {
    fullName,
    email,
    password,
    role,
  });
  return response.data;
};

export const signUpApi = async (data: signUpPayload & { otp: string }) => {
  const {name: fullName, email, password, role, otp} = data;
  const response = await api.post("/auth/signUp", {
    fullName,
    email,
    password,
    role,
    otp,
  });
  return response.data;
};

export const loginApi = async (data: loginPayload) => {
  const {email, password} = data;
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

