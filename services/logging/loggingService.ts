import { LogEntry, LogLevel, Logger, RemoteLogSink } from './types';
import { RemoteLogSinkStub } from './remoteLogSink';

/**
 * Core logging service implementation
 * Provides console logging in development and remote logging in production
 */
export class LoggingService implements Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private remoteSink?: RemoteLogSink;

  constructor(maxLogs: number = 1000, remoteSink?: RemoteLogSink) {
    this.maxLogs = maxLogs;
    this.remoteSink = remoteSink;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): LogEntry {
    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      level,
      timestamp: Date.now(),
      context,
      error,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep logs within the maximum limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to remote sink in production
    if (!__DEV__ && this.remoteSink) {
      this.remoteSink.send(entry).catch(() => {
        // Fail silently to avoid cascading errors
      });
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.context);
        break;
      case 'info':
        console.info(message, entry.context);
        break;
      case 'warn':
        console.warn(message, entry.context);
        break;
      case 'error':
        console.error(message, entry.error || entry.context);
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.addLog(entry);
    
    if (__DEV__) {
      this.logToConsole(entry);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, context);
    this.addLog(entry);
    
    if (__DEV__) {
      this.logToConsole(entry);
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.addLog(entry);
    
    if (__DEV__) {
      this.logToConsole(entry);
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.addLog(entry);
    
    // Always log errors to console, even in production
    this.logToConsole(entry);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Global logger instance
let globalLogger: LoggingService;

/**
 * Initialize the global logger
 * Call this once during app startup
 */
export function initializeLogger(options?: {
  maxLogs?: number;
  remoteEndpoint?: string;
  remoteApiKey?: string;
}): void {
  const { maxLogs = 1000, remoteEndpoint, remoteApiKey } = options || {};
  
  const remoteSink = remoteEndpoint 
    ? new RemoteLogSinkStub(remoteEndpoint, remoteApiKey)
    : undefined;

  globalLogger = new LoggingService(maxLogs, remoteSink);
}

/**
 * Get the global logger instance
 * Ensures a logger is always available even if not explicitly initialized
 */
export function getLogger(): LoggingService {
  if (!globalLogger) {
    globalLogger = new LoggingService();
  }
  return globalLogger;
}

// Convenience functions that use the global logger
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    getLogger().debug(message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    getLogger().info(message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    getLogger().warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, unknown>) =>
    getLogger().error(message, error, context),
  getLogs: () => getLogger().getLogs(),
  clearLogs: () => getLogger().clearLogs(),
};