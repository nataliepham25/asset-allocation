// GET https://api.coinbase.com/v2/exchange-rates
export interface ExchangeRatesResponse {
  data: ExchangeRatesData
}

export interface ExchangeRatesData {
  currency: string
  // Rate values are strings (e.g. "0.0000091"), not numbers — parse before use.
  rates: Record<string, string>
}

// Parsed, numeric form of the rates this app actually uses.
export interface CryptoRates {
  BTC: number
  ETH: number
}
