import { AxiosError } from "axios";

export interface ApiErrorResponse {
  code: string;
  detail: string;
}

export const getError = (err: any) => {
  const axiosError = err as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data) {
    return {
      title: axiosError.response.data.code
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      description: axiosError.response.data.detail,
    };
  }

  if (axiosError.request) {
    return {
      title: "Network Error",
      description:
        "Could not connect to the server. Please check your connection.",
    };
  }

  return {
    title: "Error",
    description: "An unexpected error occurred.",
  };
};
