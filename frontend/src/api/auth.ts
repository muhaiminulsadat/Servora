import api from "./axios";
import type {signUpPayload} from "../types/auth.types";

export const signUpMailSendApi = async (data: signUpPayload) => {
  const { name: fullName, email, password, role } = data;
  const response = await api.post("/auth/send-auth-mail", { fullName, email, password, role });
  return response.data;
};
