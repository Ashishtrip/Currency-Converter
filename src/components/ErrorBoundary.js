import React from 'react';

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in their child 
 * component tree, log those errors, and display a fallback UI instead of 
 * the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#721c24', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb', margin: '20px' }}>
          <h2>Something went wrong.</h2>
          <p>The application encountered an unexpected error. Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', textAlign: 'left' }}>
              {this.state.error && this.state.error.toString()}
            </details>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '15px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#721c24', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
