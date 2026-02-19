type ActionErrorResponse<TDetails> = {
  data: null;
  error?: {
    message?: string;
    detailes?: TDetails;
  };
};

type ActionSuccessResponse<TData> = {
  data: TData;
  error?: null;
};

export function ok<TData>(data: TData): ActionSuccessResponse<TData> {
  return {
    data,
    error: null,
  };
}

export function err<TDetails = null>(
  message: string,
  detailes?: TDetails,
): ActionErrorResponse<TDetails | null> {
  return {
    data: null,
    error: {
      message,
      detailes: detailes ?? null,
    },
  };
}
