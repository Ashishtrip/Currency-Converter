import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import CurrencySelect from './CurrencySelect';
import AmountInput from './AmountInput';
import Header from './Header';
import ErrorMessage from './ErrorMessage';
import ResultDisplay from './ResultDisplay';
import { convertCurrency, formatRate } from '../utils/conversion';

const BASE_API_URL = 'https://open.er-api.com/v6/latest';

/**
 * Main CurrencyConverter component.
 * Handles state for amount, source/target currencies, and exchange rates.
 * Fetches real-time data and provides an interface for conversion.
 */
const CurrencyConverter = () => {
  // Access global preferences from context
  const {
    defaultSourceCurrency,
    setDefaultSourceCurrency,
    defaultTargetCurrency,
    setDefaultTargetCurrency,
  } = usePreferences();

  // Local state for the converter
  const [amount, setAmount] = useState('1');
  const [sourceCurrency, setSourceCurrency] = useState(defaultSourceCurrency);
  const [targetCurrency, setTargetCurrency] = useState(defaultTargetCurrency);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the latest exchange rates from the API.
   * Uses the selected sourceCurrency as the base to ensure accurate relative rates.
   * dependencies: [sourceCurrency]
   */
  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_API_URL}/${sourceCurrency}`);
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
  }, [sourceCurrency]);

  /**
   * EFFECT: Triggers an initial fetch on mount and sets up a 2-minute refresh interval.
   * The interval is cleared on unmount to prevent memory leaks.
   * Re-runs whenever fetchRates (and thus sourceCurrency) changes.
   */
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 120000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  /**
   * EFFECT: Synchronize local currency state with persistent preferences.
   * These update whenever the user selects a new currency.
   */
  useEffect(() => {
    setDefaultSourceCurrency(sourceCurrency);
  }, [sourceCurrency, setDefaultSourceCurrency]);

  useEffect(() => {
    setDefaultTargetCurrency(targetCurrency);
  }, [targetCurrency, setDefaultTargetCurrency]);

  /**
   * Handler to swap source and target currencies.
   */
  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  /**
   * MEMO: Calculates the converted amount based on fetched rates.
   * Uses the utility function for the actual math to keep component clean.
   */
  const convertedAmount = useMemo(() => {
    const rate = rates ? rates[targetCurrency] : null;
    return convertCurrency(amount, rate);
  }, [amount, targetCurrency, rates]);

  /**
   * MEMO: Formats the current exchange rate for display (1 Source = X Target).
   */
  const currentRate = useMemo(() => {
    const rate = rates ? rates[targetCurrency] : null;
    return formatRate(rate);
  }, [targetCurrency, rates]);

  // Derived list of currency codes for the dropdowns
  const currencies = rates ? Object.keys(rates) : [];

  return (
    <div className="converter-container">
      <Header />

      {error ? (
        <ErrorMessage error={error} onRetry={fetchRates} />
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

          <ResultDisplay 
            loading={loading}
            rates={rates}
            targetCurrency={targetCurrency}
            sourceCurrency={sourceCurrency}
            convertedAmount={convertedAmount}
            currentRate={currentRate}
          />
        </>
      )}
    </div>
  );
};

export default CurrencyConverter;
