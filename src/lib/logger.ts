type LogContext = Record<string, unknown>;

function write(level: "info" | "warn" | "error", message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(entry));
    return;
  }

  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};
