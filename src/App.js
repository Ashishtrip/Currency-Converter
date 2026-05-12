import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <CurrencyConverter />
      </ErrorBoundary>
    </div>
  );
}

export default App;
