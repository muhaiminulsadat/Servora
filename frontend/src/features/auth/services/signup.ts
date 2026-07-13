import {signUpMailSendApi} from "@/api/auth";
import type {signUpPayload} from "@/types/auth.types";

export const signUpMailSendApiCall = async (data: signUpPayload) => {
  try {
    const result = await signUpMailSendApi(data);

    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  } catch (error: any) {
    console.error("Error in signup mail send: ", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to register. Please try again.";
    throw new Error(errorMessage);
  }
};
