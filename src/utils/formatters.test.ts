import { describe, it, expect } from 'vitest'
import { formatCryptoAmount, formatUsd } from './formatters'

describe('formatCryptoAmount', () => {
  it('trims trailing zeros', () => {
    expect(formatCryptoAmount(0.035, 8)).toBe('0.035')
  })

  it('keeps full precision when there are no trailing zeros', () => {
    expect(formatCryptoAmount(0.08846507, 8)).toBe('0.08846507')
  })

  it('formats zero as a bare "0"', () => {
    expect(formatCryptoAmount(0, 8)).toBe('0')
  })

  it('respects a smaller max-decimals value for ETH-style precision', () => {
    expect(formatCryptoAmount(1.204983812345, 6)).toBe('1.204984')
  })
})

describe('formatUsd', () => {
  it('formats as USD currency with thousands separators', () => {
    expect(formatUsd(7000)).toBe('$7,000.00')
  })

  it('always shows two decimal places', () => {
    expect(formatUsd(1234.5)).toBe('$1,234.50')
  })
})
