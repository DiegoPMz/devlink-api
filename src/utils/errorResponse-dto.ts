export interface ErrorResponseType {
  message: string;
  status: string;
}

export const errorResponse = (
  message: string,
  status?: string,
): ErrorResponseType => ({
  status: status ?? "404",
  message,
});
