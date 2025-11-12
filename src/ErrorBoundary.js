// src/ErrorBoundary.js
import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Oops! Something Went Wrong</h1>
          <p>We apologize for the inconvenience. Our team has been notified, and we&apos;re working to resolve the issue.</p>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details>
              <summary>Error Details</summary>
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;