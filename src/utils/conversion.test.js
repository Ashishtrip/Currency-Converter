import { convertCurrency, formatRate } from './conversion';

describe('conversion utility', () => {
  describe('convertCurrency', () => {
    test('converts 100 with rate 1.5 to 150.00', () => {
      expect(convertCurrency(100, 1.5)).toBe('150.00');
    });

    test('converts string "100" with rate 1.5 to 150.00', () => {
      expect(convertCurrency('100', 1.5)).toBe('150.00');
    });

    test('returns "0.00" for invalid amount', () => {
      expect(convertCurrency('abc', 1.5)).toBe('0.00');
      expect(convertCurrency('', 1.5)).toBe('0.00');
      expect(convertCurrency(null, 1.5)).toBe('0.00');
    });

    test('returns "0.00" for invalid rate', () => {
      expect(convertCurrency(100, 0)).toBe('0.00');
      expect(convertCurrency(100, null)).toBe('0.00');
      expect(convertCurrency(100, undefined)).toBe('0.00');
    });

    test('handles small fractional rates', () => {
      expect(convertCurrency(100, 0.001234)).toBe('0.12');
    });
  });

  describe('formatRate', () => {
    test('formats 1.234567 to 1.2346', () => {
      expect(formatRate(1.234567)).toBe('1.2346');
    });

    test('formats 1 to 1.0000', () => {
      expect(formatRate(1)).toBe('1.0000');
    });

    test('returns null for invalid rate', () => {
      expect(formatRate(null)).toBe(null);
      expect(formatRate('abc')).toBe(null);
    });
  });
});
