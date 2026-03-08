import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  requestId?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
};

export function apiSuccess<T>(data: T, status = 200, requestId?: string) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data, requestId }, { status });
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
  requestId?: string,
) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      error: { code, message, details },
      requestId,
    },
    { status },
  );
}
