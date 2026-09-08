<script setup lang="ts">
import { computed, ref } from 'vue'
import CurrencyInput from './CurrencyInput.vue'
import AllocationResult from './AllocationResult.vue'
import { useExchangeRates } from '../composables/useExchangeRates'
import { calculateAllocation, BTC_WEIGHT, ETH_WEIGHT } from '../utils/calculateAllocation'
import { formatCryptoAmount, formatUsd } from '../utils/formatters'

const BTC_COLOR = '#f7931a'
const ETH_COLOR = '#627eea'

const usdAmount = ref<number | null>(null)
const { rates, loading, error, updatedAt, refresh } = useExchangeRates()

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

const btcValue = computed(() => {
  if (isBlank.value || !allocation.value) return '—'
  return `${formatCryptoAmount(allocation.value.btcAmount, 8)} BTC`
})
const ethValue = computed(() => {
  if (isBlank.value || !allocation.value) return '—'
  return `${formatCryptoAmount(allocation.value.ethAmount, 6)} ETH`
})
const btcSubValue = computed(() =>
  isBlank.value ? '—' : `≈ ${formatUsd((usdAmount.value ?? 0) * BTC_WEIGHT)}`,
)
const ethSubValue = computed(() =>
  isBlank.value ? '—' : `≈ ${formatUsd((usdAmount.value ?? 0) * ETH_WEIGHT)}`,
)

const updatedAtLabel = computed(() =>
  updatedAt.value ? `Rates as of ${updatedAt.value.toLocaleTimeString()}` : '',
)
</script>

<template>
  <div class="allocation-calculator">
    <header class="allocation-calculator__header">
      <h1>Asset allocation calculator</h1>
      <p class="allocation-calculator__subtitle">
        See how your holdings split across BTC and ETH at a fixed 70/30 mix.
      </p>
    </header>

    <div v-if="error" class="allocation-calculator__status allocation-calculator__status--error">
      <p>{{ error }}</p>
      <button type="button" @click="refresh">Retry</button>
    </div>

    <div v-else class="allocation-calculator__body">
      <CurrencyInput
        v-if="!loading"
        v-model="usdAmount"
        label="Investable assets"
        currency="USD"
        :error="inputError"
      />
      <div v-else class="skeleton skeleton--input" aria-hidden="true" />

      <div class="allocation-calculator__results" aria-live="polite">
        <p v-if="updatedAtLabel" class="allocation-calculator__timestamp">{{ updatedAtLabel }}</p>
        <div v-else-if="loading" class="skeleton skeleton--line" aria-hidden="true" />

        <div class="proportion-bar">
          <div
            class="proportion-bar__segment"
            :style="{ width: btcPercent + '%', backgroundColor: BTC_COLOR }"
          />
          <div
            class="proportion-bar__segment"
            :style="{ width: ethPercent + '%', backgroundColor: ETH_COLOR }"
          />
        </div>

        <template v-if="!loading">
          <AllocationResult
            :label="btcLabel"
            :value="btcValue"
            :sub-value="btcSubValue"
            :accent-color="BTC_COLOR"
          />
          <AllocationResult
            :label="ethLabel"
            :value="ethValue"
            :sub-value="ethSubValue"
            :accent-color="ETH_COLOR"
          />
        </template>
        <template v-else>
          <div class="skeleton skeleton--card" aria-hidden="true" />
          <div class="skeleton skeleton--card" aria-hidden="true" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.allocation-calculator {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem;
  background: #f2f2f5;
  border-radius: 8px;
}

@media (max-width: 480px) {
  .allocation-calculator {
    padding: 1.5rem;
  }
}

.allocation-calculator__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.allocation-calculator__header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.allocation-calculator__subtitle {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.allocation-calculator__body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.allocation-calculator__results {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.allocation-calculator__timestamp {
  margin: 0;
  color: #888;
  font-size: 0.8rem;
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

.skeleton {
  border-radius: 8px;
  background: #eee;
}

.skeleton--input {
  height: 44px;
}

.skeleton--line {
  width: 140px;
  height: 14px;
}

.skeleton--card {
  height: 94px;
}
</style>
