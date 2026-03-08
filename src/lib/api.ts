import { NextResponse } from 'next/server'

export type ApiSuccessResponse<T> = {
  success: true
  data: T
  requestId?: string
}

export type ApiErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  requestId?: string
}

export const apiSuccess = <T>(data: T, init?: { status?: number; requestId?: string }) =>
  NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      data,
      requestId: init?.requestId,
    },
    { status: init?.status ?? 200 },
  )

export const apiError = (
  message: string,
  init?: {
    code?: string
    details?: unknown
    status?: number
    requestId?: string
  },
) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error: {
        code: init?.code ?? 'INTERNAL_ERROR',
        message,
        details: init?.details,
      },
      requestId: init?.requestId,
    },
    { status: init?.status ?? 500 },
  )
