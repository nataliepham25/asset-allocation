export function formatCryptoAmount(amount: number, maxDecimals: number): string {
  return trimTrailingZeros(amount.toFixed(maxDecimals))
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value
  return value.replace(/0+$/, '').replace(/\.$/, '')
}
