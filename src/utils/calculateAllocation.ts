export interface AllocationResult {
  btcAmount: number
  ethAmount: number
}

const BTC_WEIGHT = 0.7
const ETH_WEIGHT = 0.3

export function calculateAllocation(
  usdAmount: number,
  rates: { BTC: number; ETH: number },
): AllocationResult {
  if (usdAmount <= 0) {
    return { btcAmount: 0, ethAmount: 0 }
  }

  return {
    btcAmount: usdAmount * BTC_WEIGHT * rates.BTC,
    ethAmount: usdAmount * ETH_WEIGHT * rates.ETH,
  }
}
