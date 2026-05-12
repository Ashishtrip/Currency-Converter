import React from 'react';

/**
 * ErrorMessage Component
 * Displays a user-friendly error message and provides a retry mechanism.
 */
const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-message">
    <p>{error}</p>
    <button 
      onClick={onRetry} 
      title="Try fetching rates again"
      style={{
        marginTop: '10px', 
        padding: '5px 10px', 
        cursor: 'pointer', 
        background: 'transparent', 
        border: '1px solid currentColor', 
        color: 'inherit', 
        borderRadius: '4px'
      }}
    >
      Retry
    </button>
  </div>
);

export default ErrorMessage;
