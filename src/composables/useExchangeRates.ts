import { onMounted, ref } from 'vue'
import type { ExchangeRatesResponse } from '../types/exchange-rates'

const EXCHANGE_RATES_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=USD'

export interface CryptoRates {
  BTC: number
  ETH: number
}

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(EXCHANGE_RATES_URL)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const body: ExchangeRatesResponse = await response.json()

      rates.value = {
        BTC: Number(body.data.rates.BTC),
        ETH: Number(body.data.rates.ETH),
      }
    } catch {
      error.value = 'Unable to load exchange rates. Please try again.'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { rates, loading, error, refresh }
}
