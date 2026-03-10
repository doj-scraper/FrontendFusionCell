import { apiSuccess } from '@/lib/api'

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'FusionCell API',
    version: '1.0.0',
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register account',
      },
    },
    '/api/checkout/intent': {
      post: {
        summary: 'Create payment intent',
      },
    },
    '/api/contact': {
      post: {
        summary: 'Submit contact request',
      },
    },
  },
} as const

export async function GET(request: Request) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  return apiSuccess(openApiSpec, 200, requestId)
}
