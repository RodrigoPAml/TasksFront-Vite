export interface BaseResponse<T> {
  success: boolean;
  errorMessage?: string;
  code: number;
  data?: T;
}
