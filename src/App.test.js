import { render, screen } from '@testing-library/react';
import App from './App';
import { PreferencesProvider } from './context/PreferencesContext';

test('renders global converter header', () => {
  render(
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  );
  const headerElement = screen.getByText(/Global Converter/i);
  expect(headerElement).toBeInTheDocument();
});
