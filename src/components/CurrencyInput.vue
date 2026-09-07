<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: number | null
    readonly?: boolean
    error?: string | null
    symbol?: string
    symbolPosition?: 'prefix' | 'suffix'
    /** ISO 4217 currency code (e.g. "USD"). When set, the value is formatted
     * with Intl.NumberFormat while unfocused, and the `symbol` prop is ignored
     * since the currency format already carries its own symbol. */
    currency?: string
  }>(),
  {
    readonly: false,
    error: null,
    symbol: '',
    symbolPosition: 'prefix',
    currency: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputId = useId()
const errorId = useId()
const isFocused = ref(false)
const rawInput = ref(props.modelValue === null ? '' : String(props.modelValue))

const currencyFormatter = computed(() =>
  props.currency
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency })
    : null,
)

// Only sync from outside while the field isn't focused, so we don't clobber
// what the user is mid-typing (e.g. a trailing "." or "-").
watch(
  () => props.modelValue,
  (value) => {
    if (!isFocused.value) {
      rawInput.value = value === null ? '' : String(value)
    }
  },
)

const displayValue = computed(() => {
  if (isFocused.value || !currencyFormatter.value) return rawInput.value
  return props.modelValue === null ? '' : currencyFormatter.value.format(props.modelValue)
})

function onFocus() {
  isFocused.value = true
  rawInput.value = props.modelValue === null ? '' : String(props.modelValue)
}

function onBlur() {
  isFocused.value = false
}

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  rawInput.value = raw

  const cleaned = raw.replace(/[^0-9.-]/g, '')
  const parsed = Number(cleaned)
  emit('update:modelValue', cleaned === '' || Number.isNaN(parsed) ? null : parsed)
}
</script>

<template>
  <div class="currency-input">
    <label :for="inputId">{{ label }}</label>
    <div class="currency-input__field" :class="{ 'currency-input__field--error': !!error }">
      <span
        v-if="symbol && symbolPosition === 'prefix' && !currency"
        class="currency-input__symbol"
      >
        {{ symbol }}
      </span>
      <input
        :id="inputId"
        type="text"
        inputmode="decimal"
        :value="displayValue"
        :readonly="readonly"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      />
      <span
        v-if="symbol && symbolPosition === 'suffix' && !currency"
        class="currency-input__symbol"
      >
        {{ symbol }}
      </span>
    </div>
    <p v-if="error" :id="errorId" class="currency-input__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.currency-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
}

.currency-input__field {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e4e7;
  border-radius: 8px;
  padding: 10px 14px;
  background: #f8f8fa;
}

.currency-input__field--error {
  border-color: #d33;
}

.currency-input__field:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.currency-input__field input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}

.currency-input__symbol {
  color: #888;
}

.currency-input__error {
  margin: 0;
  color: #d33;
  font-size: 0.85rem;
}
</style>
