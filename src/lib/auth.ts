import { apiFetch } from "./api";
import { ApiResponse, RegisterPayload, AuthResponseData } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginReseller(
  payload: LoginPayload,
): Promise<ApiResponse<AuthResponseData | null>> {
  try {
    const result = await apiFetch<ApiResponse<AuthResponseData>>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (result.success && result.data?.api_key) {
      localStorage.setItem("vtu_auth_token", result.data.api_key);
      localStorage.setItem("vtu_user_id", result.data.id);
      localStorage.setItem("vtu_user_email", result.data.email);
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Invalid Credentials. Please try again.",
      data: null,
    };
  }
}

export async function registerReseller(
  payload: RegisterPayload,
  adminToken?: string,
): Promise<ApiResponse<AuthResponseData | null>> {
  try {
    const result = await apiFetch<ApiResponse<AuthResponseData>>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
        adminToken, // Passes token if required by backend user creation rules
      },
    );

    if (result.success && result.data?.api_key) {
      localStorage.setItem("vtu_auth_token", result.data.api_key);
      localStorage.setItem("vtu_user_id", result.data.id);
      localStorage.setItem("vtu_user_email", result.data.email);
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration Failed. Please try again.",
      data: null,
    };
  }
}

export function logoutReseller(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vtu_auth_token");
    localStorage.removeItem("vtu_user_id");
    localStorage.removeItem("vtu_user_email");
    window.location.href = "/login";
  }
}
