export type signUpPayload = {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
};

export type loginPayload = Pick<signUpPayload, "email" | "password">;