'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; 
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600 mb-2">
            We&apos;re sorry for the inconvenience. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details className="text-sm text-gray-500 mt-4 p-2 bg-gray-100 rounded">
              <summary>Error Details</summary>
              <pre className="whitespace-pre-wrap break-all">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
