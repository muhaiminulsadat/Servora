import {loginApi} from "@/api/auth";
import type {loginPayload} from "@/types/auth.types";

export const loginApiCall = async (data: loginPayload) => {
  try {
    const result = await loginApi(data);

    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  } catch (error: any) {
    console.error("Error in login: ", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to login. Please try again.";
    throw new Error(errorMessage);
  }
};
