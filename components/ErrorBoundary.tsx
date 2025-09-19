import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { logger } from "@/services/logging";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  isDark?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global error boundary component that catches JavaScript errors
 * anywhere in the child component tree and logs them
 */
export class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our logging service
    logger.error("Uncaught error in component tree", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: "ErrorBoundary",
    });

    // Update state with error info for debugging
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default fallback UI with theme support
      const isDark = this.props.isDark ?? false;
      const dynamicStyles = createDynamicStyles(isDark);

      return (
        <View style={[styles.container, dynamicStyles.container]}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            <Text style={[styles.title, dynamicStyles.title]}>Something went wrong</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              An unexpected error occurred. The error has been logged and reported.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={[styles.debugSection, dynamicStyles.debugSection]}>
                <Text style={[styles.debugTitle, dynamicStyles.debugTitle]}>Debug Information</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>

                {this.state.errorInfo && (
                  <Text style={[styles.stackTrace, dynamicStyles.stackTrace]}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <Text
              style={[styles.resetButton, dynamicStyles.resetButton]}
              onPress={this.handleReset}
            >
              Try Again
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple wrapper that doesn't require theme context
 * Use this when you need error boundary without theme support
 */
export function ErrorBoundary({ children, fallback }: Omit<Props, "isDark">) {
  return <ErrorBoundaryBase fallback={fallback}>{children}</ErrorBoundaryBase>;
}

function createDynamicStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#000000" : "#ffffff",
    },
    title: {
      color: "#dc2626",
    },
    subtitle: {
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    debugSection: {
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
    },
    debugTitle: {
      color: isDark ? "#d1d5db" : "#374151",
    },
    stackTrace: {
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    resetButton: {
      color: "#2563eb",
      backgroundColor: isDark ? "#1e3a8a" : "#eff6ff",
    },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  debugSection: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    fontFamily: "Courier New",
    marginBottom: 12,
  },
  stackTrace: {
    fontSize: 10,
    fontFamily: "Courier New",
  },
  resetButton: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    overflow: "hidden",
  },
});
