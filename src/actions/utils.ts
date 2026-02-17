type ActionErrorResponse<TDetails> = {
  message?: string;
  detailes?: TDetails;
};

export function err<TDetails = null>(
  message: string,
  detailes?: TDetails,
): ActionErrorResponse<TDetails | null> {
  return {
    message,
    detailes: detailes ?? null,
  };
}
