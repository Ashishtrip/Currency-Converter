import React, { createContext, useState, useContext } from 'react';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [defaultSourceCurrency, setDefaultSourceCurrency] = useState('USD');
  const [defaultTargetCurrency, setDefaultTargetCurrency] = useState('EUR');

  const value = {
    defaultSourceCurrency,
    setDefaultSourceCurrency,
    defaultTargetCurrency,
    setDefaultTargetCurrency,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  return useContext(PreferencesContext);
};
