import {signUpApi} from "@/api/auth";
import type {signUpPayload} from "@/types/auth.types";

export const signUpVerifyApiCall = async (data: signUpPayload & {otp: string}) => {
  try {
    const result = await signUpApi(data);

    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  } catch (error: any) {
    console.error("Error in OTP verification: ", error);
    const errorMessage = error.response?.data?.message || error.message || "Verification failed. Please try again.";
    throw new Error(errorMessage);
  }
};
