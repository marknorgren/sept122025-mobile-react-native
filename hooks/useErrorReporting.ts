import { useCallback } from 'react';
import { logger } from '@/services/logging';

/**
 * Hook for capturing and reporting errors in React components
 * Provides convenient methods for error logging with context
 */
export function useErrorReporting() {
  const reportError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      logger.error('Component error reported', error, context);
    },
    [],
  );

  const reportWarning = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logger.warn(message, context);
    },
    [],
  );

  const reportInfo = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logger.info(message, context);
    },
    [],
  );

  const reportDebug = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logger.debug(message, context);
    },
    [],
  );

  /**
   * Wrap an async function with error reporting
   * Automatically logs any errors thrown during execution
   */
  const withErrorReporting = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => Promise<R>,
      context?: Record<string, unknown>,
    ) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await fn(...args);
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          reportError(errorObj, {
            ...context,
            functionName: fn.name,
            arguments: args,
          });
          return undefined;
        }
      };
    },
    [reportError],
  );

  /**
   * Wrap a synchronous function with error reporting
   * Automatically logs any errors thrown during execution
   */
  const withSyncErrorReporting = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => R,
      context?: Record<string, unknown>,
    ) => {
      return (...args: T): R | undefined => {
        try {
          return fn(...args);
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          reportError(errorObj, {
            ...context,
            functionName: fn.name,
            arguments: args,
          });
          return undefined;
        }
      };
    },
    [reportError],
  );

  return {
    reportError,
    reportWarning,
    reportInfo,
    reportDebug,
    withErrorReporting,
    withSyncErrorReporting,
  };
}