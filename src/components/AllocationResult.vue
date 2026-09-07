<script setup lang="ts">
defineProps<{
  label: string
  value: string
  subValue: string
}>()
</script>

<template>
  <div class="allocation-result">
    <p class="allocation-result__label">{{ label }}</p>
    <p class="allocation-result__value">{{ value }}</p>
    <p class="allocation-result__sub-value">{{ subValue }}</p>
  </div>
</template>

<style scoped>
.allocation-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid #e5e4e7;
  border-radius: 8px;
}

.allocation-result__label {
  margin: 0;
  color: #888;
  font-size: 0.85rem;
}

.allocation-result__value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.allocation-result__sub-value {
  margin: 0;
  color: #888;
  font-size: 0.85rem;
}
</style>
