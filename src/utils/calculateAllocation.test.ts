import { describe, it, expect } from 'vitest'
import { calculateAllocation } from './calculateAllocation'

describe('calculateAllocation', () => {
  it('splits a round USD amount 70/30 into BTC/ETH', () => {
    const result = calculateAllocation(1000, { BTC: 0.00005, ETH: 0.0003 })

    expect(result.btcAmount).toBeCloseTo(0.035, 10)
    expect(result.ethAmount).toBeCloseTo(0.09, 10)
  })

  it('returns zeros for a zero USD amount', () => {
    const result = calculateAllocation(0, { BTC: 0.00005, ETH: 0.0003 })

    expect(result).toEqual({ btcAmount: 0, ethAmount: 0 })
  })

  it('returns zeros for a negative USD amount instead of throwing', () => {
    const result = calculateAllocation(-100, { BTC: 0.00005, ETH: 0.0003 })

    expect(result).toEqual({ btcAmount: 0, ethAmount: 0 })
  })

  it('preserves full precision for very small BTC fractions', () => {
    const result = calculateAllocation(10, { BTC: 0.0000091, ETH: 0.0003 })

    // 10 * 0.7 * 0.0000091 = 0.0000637, well within BTC's 8-decimal precision
    expect(result.btcAmount).toBeCloseTo(0.0000637, 12)
    expect(result.btcAmount).not.toBe(0)
  })
})
