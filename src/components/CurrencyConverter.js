import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import CurrencySelect from './CurrencySelect';
import AmountInput from './AmountInput';

const API_URL = 'https://open.er-api.com/v6/latest/USD';

const CurrencyConverter = () => {
  const {
    defaultSourceCurrency,
    setDefaultSourceCurrency,
    defaultTargetCurrency,
    setDefaultTargetCurrency,
  } = usePreferences();

  const [amount, setAmount] = useState('1');
  const [sourceCurrency, setSourceCurrency] = useState(defaultSourceCurrency);
  const [targetCurrency, setTargetCurrency] = useState(defaultTargetCurrency);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      const data = await response.json();
      setRates(data.rates);
      setLoading(false);
    } catch (err) {
      setError('Unable to fetch exchange rates. Please check your connection and try again later.');
      setLoading(false);
    }
  }, []);

  // Fetch on mount and set up interval for real-time updates (every 2 minutes)
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 120000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Update preferences when currencies change
  useEffect(() => {
    setDefaultSourceCurrency(sourceCurrency);
  }, [sourceCurrency, setDefaultSourceCurrency]);

  useEffect(() => {
    setDefaultTargetCurrency(targetCurrency);
  }, [targetCurrency, setDefaultTargetCurrency]);

  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  // Optimize conversion calculations using useMemo
  const convertedAmount = useMemo(() => {
    if (!rates || !amount || isNaN(amount)) return '0.00';
    const amountNum = parseFloat(amount);
    
    // Cross-rate calculation (since base is USD)
    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];
    
    if (!sourceRate || !targetRate) return '0.00';
    
    const result = amountNum * (targetRate / sourceRate);
    return result.toFixed(2);
  }, [amount, sourceCurrency, targetCurrency, rates]);

  // Current exchange rate (1 Source = X Target)
  const currentRate = useMemo(() => {
    if (!rates || !rates[sourceCurrency] || !rates[targetCurrency]) return null;
    const rate = rates[targetCurrency] / rates[sourceCurrency];
    return rate.toFixed(4);
  }, [sourceCurrency, targetCurrency, rates]);

  const currencies = rates ? Object.keys(rates) : [];

  return (
    <div className="converter-container">
      <div className="header">
        <h1>Global Converter</h1>
        <p>Real-time live exchange rates</p>
      </div>

      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchRates} style={{marginTop: '10px', padding: '5px 10px', cursor: 'pointer', background: 'transparent', border: '1px solid currentColor', color: 'inherit', borderRadius: '4px'}}>Retry</button>
        </div>
      ) : (
        <>
          <AmountInput
            value={amount}
            onChange={setAmount}
            disabled={loading && !rates}
          />

          <div className="currency-row">
            <CurrencySelect
              label="From"
              value={sourceCurrency}
              onChange={setSourceCurrency}
              currencies={currencies}
              disabled={loading && !rates}
            />

            <button
              className="swap-btn"
              onClick={handleSwap}
              disabled={loading && !rates}
              title="Swap currencies"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12" />
                <path d="M15 5.86 15 14" />
                <path d="m10.5 14.5-3.5 3.5-3.5-3.5" />
                <path d="m18.5 9.5-3.5-3.5-3.5 3.5" />
              </svg>
            </button>

            <CurrencySelect
              label="To"
              value={targetCurrency}
              onChange={setTargetCurrency}
              currencies={currencies}
              disabled={loading && !rates}
            />
          </div>

          <div className="result-section">
            {loading && !rates ? (
              <div className="loading-message">Fetching latest rates...</div>
            ) : (
              <>
                <div className="result-amount">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(convertedAmount)}
                </div>
                {currentRate && (
                  <div className="result-rate">
                    1 {sourceCurrency} = {currentRate} {targetCurrency}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencyConverter;
