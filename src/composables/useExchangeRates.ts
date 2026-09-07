import { onMounted, ref, type Ref } from 'vue'
import type { CryptoRates, ExchangeRatesResponse } from '../types/exchange-rates'

const EXCHANGE_RATES_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=USD'

export interface UseExchangeRatesReturn {
  rates: Ref<CryptoRates | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  updatedAt: Ref<Date | null>
  refresh: () => Promise<void>
}

function isExchangeRatesResponse(value: unknown): value is ExchangeRatesResponse {
  if (typeof value !== 'object' || value === null) return false

  const data = (value as Record<string, unknown>).data
  if (typeof data !== 'object' || data === null) return false

  const rates = (data as Record<string, unknown>).rates
  if (typeof rates !== 'object' || rates === null) return false

  const { BTC, ETH } = rates as Record<string, unknown>
  return typeof BTC === 'string' && typeof ETH === 'string'
}

export function useExchangeRates(): UseExchangeRatesReturn {
  const rates = ref<CryptoRates | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const updatedAt = ref<Date | null>(null)

  async function refresh(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(EXCHANGE_RATES_URL)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const body: unknown = await response.json()

      if (!isExchangeRatesResponse(body)) {
        throw new Error('Unexpected response shape from exchange rates API')
      }

      rates.value = {
        BTC: Number(body.data.rates.BTC),
        ETH: Number(body.data.rates.ETH),
      }
      updatedAt.value = new Date()
    } catch {
      error.value = 'Unable to load exchange rates. Please try again.'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { rates, loading, error, updatedAt, refresh }
}
