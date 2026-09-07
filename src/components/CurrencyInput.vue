<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    modelValue: number | null
    readonly?: boolean
    error?: string | null
    symbol?: string
    symbolPosition?: 'prefix' | 'suffix'
  }>(),
  {
    readonly: false,
    error: null,
    symbol: '',
    symbolPosition: 'prefix',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputId = useId()
const errorId = useId()

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  emit('update:modelValue', raw === '' ? null : Number(raw))
}
</script>

<template>
  <div class="currency-input">
    <label :for="inputId">{{ label }}</label>
    <div class="currency-input__field" :class="{ 'currency-input__field--error': !!error }">
      <span v-if="symbol && symbolPosition === 'prefix'" class="currency-input__symbol">
        {{ symbol }}
      </span>
      <input
        :id="inputId"
        type="number"
        :value="modelValue ?? ''"
        :readonly="readonly"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        @input="onInput"
      />
      <span v-if="symbol && symbolPosition === 'suffix'" class="currency-input__symbol">
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
  border: 1px solid #d0d0d5;
  border-radius: 6px;
  padding: 8px 12px;
}

.currency-input__field--error {
  border-color: #d33;
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
