<template>
  <component :is="onlyTemplate ? 'div' : 'label'" class="field-label">
    <template v-if="label">
      <div
        class="flex items-center justify-between mb-1 ml-2 text-sm font-normal"
      >
        <span>{{ label }}</span>

        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </div>
    </template>
    <div class="relative">
      <slot />
    </div>
  </component>
</template>

<script lang="ts" setup>
defineProps<{
  label?: string;
  // Used in case you want omit using `label` but still need to use styles and
  // template. For example when `label` triggers unnecessary cliks of buttons inside
  onlyTemplate?: boolean;
}>();
</script>
