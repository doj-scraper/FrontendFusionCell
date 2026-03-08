import 'server-only'

import { env } from '@/lib/env'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

type LogContext = Record<string, unknown>

type LogPayload = {
  context?: LogContext
  error?: Error | unknown
  requestId?: string
}

const shouldLogDebug = env.NODE_ENV !== 'production'

const formatLog = (level: LogLevel, message: string, payload?: LogPayload) => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  requestId: payload?.requestId,
  context: payload?.context,
  error:
    payload?.error instanceof Error
      ? {
          name: payload.error.name,
          message: payload.error.message,
          stack: payload.error.stack,
        }
      : payload?.error,
})

const writeLog = (level: LogLevel, message: string, payload?: LogPayload) => {
  if (level === 'debug' && !shouldLogDebug) {
    return
  }

  const entry = formatLog(level, message, payload)

  if (level === 'error') {
    console.error(entry)
    return
  }

  if (level === 'warn') {
    console.warn(entry)
    return
  }

  console.log(entry)
}

export const logger = {
  info: (message: string, payload?: LogPayload) => writeLog('info', message, payload),
  warn: (message: string, payload?: LogPayload) => writeLog('warn', message, payload),
  error: (message: string, payload?: LogPayload) => writeLog('error', message, payload),
  debug: (message: string, payload?: LogPayload) => writeLog('debug', message, payload),
}

export type { LogContext, LogPayload, LogLevel }
