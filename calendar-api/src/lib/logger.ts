type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

export function log({ level, message, requestId, context }: LogPayload): void {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    message,
    requestId,
    context
  };
  console[level](JSON.stringify(record));
}
