import { LogEntry, RemoteLogSink } from './types';

/**
 * Stub implementation for remote logging sink
 * In production, this would connect to your actual logging service
 * (e.g., Sentry, Datadog, custom analytics endpoint)
 */
export class RemoteLogSinkStub implements RemoteLogSink {
  private endpoint: string;
  private apiKey?: string;

  constructor(endpoint: string = 'https://api.example.com/logs', apiKey?: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async send(entry: LogEntry): Promise<void> {
    try {
      // In a real implementation, this would make an HTTP request
      // For now, we'll just simulate the call and log to console in dev mode
      if (__DEV__) {
        console.log('[RemoteLogSink] Would send to remote:', {
          endpoint: this.endpoint,
          entry: {
            ...entry,
            // Don't log sensitive context in dev mode
            context: entry.context ? Object.keys(entry.context) : undefined,
          },
        });
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // In production, you would implement actual remote logging here:
      // const response = await fetch(this.endpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      //   },
      //   body: JSON.stringify(entry),
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Remote logging failed: ${response.statusText}`);
      // }
    } catch (error) {
      // Fail silently in production to avoid cascading errors
      if (__DEV__) {
        console.warn('[RemoteLogSink] Failed to send log entry:', error);
      }
    }
  }
}