// src/ErrorBoundary.js
import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    this.setState({ 
      error: error,
      errorInfo: errorInfo 
    });
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
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;