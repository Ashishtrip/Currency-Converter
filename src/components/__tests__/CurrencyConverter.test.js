import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CurrencyConverter from '../CurrencyConverter';
import { PreferencesProvider } from '../../context/PreferencesContext';

// Mock fetch
global.fetch = jest.fn();

const renderWithProvider = (ui) => {
  return render(
    <PreferencesProvider>
      {ui}
    </PreferencesProvider>
  );
};

describe('CurrencyConverter Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders header and initial state', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rates: { USD: 1, EUR: 0.85, GBP: 0.75 } }),
    });

    renderWithProvider(<CurrencyConverter />);

    expect(screen.getByText(/Global Converter/i)).toBeInTheDocument();
    expect(screen.getByText(/Fetching latest rates.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Fetching latest rates.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderWithProvider(<CurrencyConverter />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to fetch exchange rates/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Retry/i)).toBeInTheDocument();
  });

  test('swaps currencies', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { USD: 1, EUR: 0.85, GBP: 0.75 } }),
    });

    renderWithProvider(<CurrencyConverter />);

    await waitFor(() => {
      expect(screen.queryByText(/Fetching latest rates.../i)).not.toBeInTheDocument();
    });

    const swapBtn = screen.getByTitle(/Swap currencies/i);
    fireEvent.click(swapBtn);

    // Initial source is USD. After swap it should be EUR (the default target).
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/EUR'));
    });
  });
});
