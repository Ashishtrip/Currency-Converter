import React, { memo } from 'react';

const CurrencySelect = memo(({ label, value, onChange, currencies, disabled }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <select
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
});

export default CurrencySelect;
