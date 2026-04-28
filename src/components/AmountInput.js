import React, { memo } from 'react';

const AmountInput = memo(({ value, onChange, disabled }) => {
  // Prevent negative numbers and invalid characters
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="input-group">
      <label>Amount</label>
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={handleChange}
        placeholder="Enter amount"
        disabled={disabled}
      />
    </div>
  );
});

export default AmountInput;
