import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { monitoring } from '@/lib/monitoring'

export async function GET(request: Request) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
  }

  return apiSuccess(monitoring.snapshot(), 200, requestId)
}
