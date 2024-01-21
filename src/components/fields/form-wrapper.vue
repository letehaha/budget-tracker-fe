<template>
  <div class="form-wrapper">
    <template v-if="Array.isArray(error)">
      <div class="form-wrapper__error-list">
        <template v-for="item in error" :key="item">
          <p class="form-wrapper__error">
            {{ item }}
          </p>
        </template>
      </div>
    </template>
    <template v-else-if="error">
      <div class="form-wrapper__error-list">
        <p class="form-wrapper__error">
          {{ error }}
        </p>
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: string[] | string | null;
}>();
</script>

<style lang="scss" scoped>
.form-wrapper__error-list {
  display: grid;
  grid-gap: 8px;

  &:not(:empty) {
    margin-bottom: 16px;
  }
}
.form-wrapper__error {
  text-align: center;
  color: var(--app-danger-color-text);
  font-size: 14px;
  line-height: 1.3;
}
</style>
