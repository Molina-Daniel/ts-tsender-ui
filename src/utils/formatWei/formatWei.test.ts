import { describe, it, expect } from 'vitest';
import { formatWei } from './formatWei';

describe('formatWei', () => {
  it('should correctly convert wei to 4 decimal places', () => {
    expect(formatWei(1000000000, 9)).toBe('1.0000');
    expect(formatWei(1500000000, 9)).toBe('1.5000');
    expect(formatWei(123456789, 8)).toBe('1.2346');
  });

  it('should handle zero value', () => {
    expect(formatWei(0, 18)).toBe('0.0000');
  });

  it('should handle large values', () => {
    expect(formatWei(1000000000000000000, 18)).toBe('1.0000');
    expect(formatWei(1234567890123456789, 18)).toBe('1.2346');
  });

  it('should handle different decimal places', () => {
    // 1 ETH with 18 decimals
    expect(formatWei(1000000000000000000, 18)).toBe('1.0000');
    // 1 USDC with 6 decimals
    expect(formatWei(1000000, 6)).toBe('1.0000');
    // 1 BTC with 8 decimals
    expect(formatWei(100000000, 8)).toBe('1.0000');
  });

  it('should handle values less than smallest unit', () => {
    expect(formatWei(1, 18)).toBe('0.0000');
    expect(formatWei(100, 18)).toBe('0.0000');
    expect(formatWei(10000, 18)).toBe('0.0000');
  });

  it('should handle fractional values correctly', () => {
    expect(formatWei(1234567890, 9)).toBe('1.2346');
    expect(formatWei(9876543210, 9)).toBe('9.8765');
  });
});