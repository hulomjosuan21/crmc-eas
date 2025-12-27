import { AxiosError } from "axios";

export interface ApiErrorResponse {
  code?: string;
  detail?: string | any;
}

export const getError = (err: unknown) => {
  const axiosError = err as AxiosError<ApiErrorResponse>;

  // 1. Handle Response from Backend
  if (axiosError.response?.data) {
    const data = axiosError.response.data;
    const code = data?.code;
    const detail = data?.detail;

    // Fix: Ensure code is treated as a string before mapping
    // We use a fallback string to prevent the 'never' type error
    const title = (code || "ERROR")
      .toLowerCase()
      .split("_")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Handle the description logic
    let description = "An unexpected error occurred.";
    if (typeof detail === "string") {
      description = detail;
    } else if (Array.isArray(detail)) {
      // Handles FastAPI validation error lists
      description = detail.map((e) => e.msg || JSON.stringify(e)).join(", ");
    } else if (detail && typeof detail === "object") {
      description = JSON.stringify(detail);
    }

    return { title, description };
  }

  // 2. Handle Network/Timeout Errors
  if (axiosError.request) {
    return {
      title: "Network Error",
      description:
        "Could not connect to the server. Please check your connection.",
    };
  }

  // 3. Handle Other Unexpected Errors
  return {
    title: "Error",
    description: (err as Error)?.message || "Something went wrong.",
  };
};
