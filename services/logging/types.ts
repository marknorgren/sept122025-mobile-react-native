/**
 * Logging service types and interfaces
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: number;
  context?: Record<string, unknown>;
  error?: Error;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  getLogs(): LogEntry[];
  clearLogs(): void;
}

export interface RemoteLogSink {
  send(entry: LogEntry): Promise<void>;
}