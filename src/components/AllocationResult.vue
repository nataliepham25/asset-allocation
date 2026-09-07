<script setup lang="ts">
interface AllocationResultProps {
  label: string
  value: string
  subValue: string
  accentColor: string
}

defineProps<AllocationResultProps>()
</script>

<template>
  <div class="allocation-result">
    <div class="allocation-result__main">
      <p class="allocation-result__label">
        <span
          class="allocation-result__accent"
          :style="{ backgroundColor: accentColor }"
          aria-hidden="true"
        />
        {{ label }}
      </p>
      <p class="allocation-result__value">{{ value }}</p>
    </div>
    <p class="allocation-result__sub-value">{{ subValue }}</p>
  </div>
</template>

<style scoped>
.allocation-result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 12px;
  padding: 16px;
  border: 1px solid #e5e4e7;
  border-radius: 8px;
  background: #f8f8fa;
}

.allocation-result__main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.allocation-result__label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: #888;
  font-size: 0.85rem;
}

.allocation-result__accent {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
}

.allocation-result__value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  white-space: nowrap;
}

.allocation-result__sub-value {
  margin: 0 0 0 auto;
  flex-shrink: 0;
  color: #888;
  font-size: 0.85rem;
  text-align: right;
  white-space: nowrap;
}
</style>
