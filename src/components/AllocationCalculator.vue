<script setup lang="ts">
import { computed, ref } from 'vue'
import CurrencyInput from './CurrencyInput.vue'
import AllocationResult from './AllocationResult.vue'
import { useExchangeRates } from '../composables/useExchangeRates'
import { calculateAllocation, BTC_WEIGHT, ETH_WEIGHT } from '../utils/calculateAllocation'

const usdAmount = ref<number | null>(null)
const { rates, loading, error, refresh } = useExchangeRates()

const isNegative = computed(() => usdAmount.value !== null && usdAmount.value < 0)
const inputError = computed(() =>
  isNegative.value ? 'Investable assets cannot be negative.' : null,
)

const allocation = computed(() => {
  if (!rates.value) return null
  return calculateAllocation(usdAmount.value ?? 0, rates.value)
})

const isBlank = computed(() => isNegative.value || !allocation.value)

const btcPercent = computed(() => (isNegative.value ? 0 : BTC_WEIGHT * 100))
const ethPercent = computed(() => (isNegative.value ? 0 : ETH_WEIGHT * 100))

const btcLabel = `${Math.round(BTC_WEIGHT * 100)}% BTC allocation`
const ethLabel = `${Math.round(ETH_WEIGHT * 100)}% ETH allocation`

const btcValue = computed(() =>
  isBlank.value ? '—' : formatCrypto(allocation.value!.btcAmount, 'BTC'),
)
const ethValue = computed(() =>
  isBlank.value ? '—' : formatCrypto(allocation.value!.ethAmount, 'ETH'),
)
const btcSubValue = computed(() =>
  isBlank.value ? '—' : formatUsd((usdAmount.value ?? 0) * BTC_WEIGHT),
)
const ethSubValue = computed(() =>
  isBlank.value ? '—' : formatUsd((usdAmount.value ?? 0) * ETH_WEIGHT),
)

function formatCrypto(amount: number, symbol: string): string {
  return `${amount.toFixed(8)} ${symbol}`
}

function formatUsd(amount: number): string {
  return `≈ $${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
</script>

<template>
  <div class="allocation-calculator">
    <h1>Asset allocation calculator</h1>

    <p v-if="loading" class="allocation-calculator__status">Loading exchange rates…</p>

    <div
      v-else-if="error"
      class="allocation-calculator__status allocation-calculator__status--error"
    >
      <p>{{ error }}</p>
      <button type="button" @click="refresh">Retry</button>
    </div>

    <div v-else class="allocation-calculator__layout">
      <CurrencyInput v-model="usdAmount" label="Investable assets" symbol="$" :error="inputError" />

      <div class="allocation-calculator__results">
        <div class="proportion-bar">
          <div
            class="proportion-bar__segment proportion-bar__segment--btc"
            :style="{ width: btcPercent + '%' }"
          />
          <div
            class="proportion-bar__segment proportion-bar__segment--eth"
            :style="{ width: ethPercent + '%' }"
          />
        </div>

        <AllocationResult :label="btcLabel" :value="btcValue" :sub-value="btcSubValue" />
        <AllocationResult :label="ethLabel" :value="ethValue" :sub-value="ethSubValue" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.allocation-calculator {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.allocation-calculator__layout {
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
}

.allocation-calculator__results {
  display: flex;
  flex: 1;
  min-width: 240px;
  flex-direction: column;
  gap: 16px;
}

.allocation-calculator__status {
  color: #888;
}

.allocation-calculator__status--error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  color: #d33;
}

.proportion-bar {
  display: flex;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: #eee;
}

.proportion-bar__segment {
  height: 100%;
  transition: width 0.2s ease;
}

.proportion-bar__segment--btc {
  background: #f7931a;
}

.proportion-bar__segment--eth {
  background: #627eea;
}
</style>
