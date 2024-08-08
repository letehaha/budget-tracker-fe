<template>
  <component :is="onlyTemplate ? 'div' : 'label'" class="field-label">
    <template v-if="label">
      <div
        class="text-base font-normal tracking-wide text-[var(--app-on-surface-color)] mb-1 flex items-center justify-between"
      >
        <span>{{ label }}</span>

        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </div>
    </template>
    <template v-else-if="$slots.label">
      <slot name="label" />
    </template>
    <div class="relative">
      <slot />
    </div>
  </component>
</template>

<script lang="ts" setup>
defineProps<{
  label?: string;
  onlyTemplate?: boolean;
}>();
</script>
