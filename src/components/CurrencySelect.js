import React, { memo, useState, useRef, useEffect } from 'react';

const getFlagEmoji = (currencyCode) => {
  if (!currencyCode) return '';
  
  const specialCases = {
    'EUR': 'EU',
    'BTC': '₿',
    'ETH': 'Ξ',
    'XAG': '🥈',
    'XAU': '🥇',
    'XDR': '🏦',
  };
  
  if (specialCases[currencyCode]) {
    if (currencyCode === 'EUR') {
        const codePoints = 'EU'.split('').map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }
    return specialCases[currencyCode];
  }

  // Non-fiat currencies usually start with X, default to plain flag
  if (currencyCode.startsWith('X')) {
      return '🏳️';
  }

  const countryCode = currencyCode.substring(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  try {
      return String.fromCodePoint(...codePoints);
  } catch (e) {
      return '🏳️';
  }
};

const CurrencySelect = memo(({ label, value, onChange, currencies, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="input-group" ref={wrapperRef}>
      <label>{label}</label>
      <div 
        className={`custom-select ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="selected-value form-control">
          <span>{getFlagEmoji(value)} {value}</span>
          <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
        </div>
        
        {isOpen && (
          <ul className="options-list">
            {currencies.map((currency) => (
              <li 
                key={currency} 
                className={`option ${currency === value ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(currency);
                  setIsOpen(false);
                }}
              >
                {getFlagEmoji(currency)} {currency}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default CurrencySelect;
