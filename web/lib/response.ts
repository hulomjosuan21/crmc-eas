export type ApiResponse<T = any> = {
  success: boolean;
  code: string;
  detail: string;
  payload?: T;
} & T;
