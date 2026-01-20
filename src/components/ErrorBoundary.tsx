import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to render fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error information
    console.error("Error caught by Error Boundary:", error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center">
          <p className="text-red-500">Something went wrong.</p>
          {/* {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Error Details</summary>
              <p><strong>Error:</strong> {this.state.error.message}</p>
              <p><strong>Stack:</strong></p>
              <pre>{this.state.error.stack}</pre>
              <p><strong>Error Info:</strong></p>
              <pre>{JSON.stringify(this.state.errorInfo, null, 2)}</pre>
            </details>
          )} */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
