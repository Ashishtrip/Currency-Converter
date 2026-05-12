/**
 * Performs currency conversion calculation.
 * @param {string|number} amount - The amount to convert.
 * @param {number} rate - The exchange rate (1 source = X target).
 * @returns {string} - The converted amount formatted to 2 decimal places.
 */
export const convertCurrency = (amount, rate) => {
  if (!amount || isNaN(amount) || !rate) return '0.00';
  const amountNum = parseFloat(amount);
  const result = amountNum * rate;
  return result.toFixed(2);
};

/**
 * Formats a conversion rate for display.
 * @param {number} rate - The exchange rate.
 * @returns {string|null} - Formatted rate or null if invalid.
 */
export const formatRate = (rate) => {
  if (!rate || isNaN(rate)) return null;
  return parseFloat(rate).toFixed(4);
};
