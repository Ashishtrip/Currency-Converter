import React from 'react';

/**
 * ResultDisplay Component
 * Renders the calculated conversion result and the current exchange rate.
 * Handles the loading state when rates are being fetched for the first time.
 */
const ResultDisplay = ({ loading, rates, targetCurrency, sourceCurrency, convertedAmount, currentRate }) => {
  // Show loading message only if we don't have any rates yet
  if (loading && !rates) {
    return (
      <div className="result-section">
        <div className="loading-message">Fetching latest rates...</div>
      </div>
    );
  }

  return (
    <div className="result-section">
      <div className="result-amount">
        {/* Format the result as currency based on the target selection */}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(convertedAmount)}
      </div>
      {/* Show the unit exchange rate for clarity */}
      {currentRate && (
        <div className="result-rate">
          1 {sourceCurrency} = {currentRate} {targetCurrency}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
