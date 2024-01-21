<template>
  <div
    class="widget-wrapper"
    :class="{
      'widget-wrapper--higher': higher,
    }"
  >
    <div class="widget-wrapper__header">
      <slot name="header">
        <div class="widget-wrapper__header-content">
          <h3 class="widget-wrapper__title">
            {{ title }}
          </h3>
          <slot name="action" />
        </div>
      </slot>
    </div>

    <div class="widget-wrapper__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    higher?: boolean;
  }>(),
  {
    title: undefined,
  },
);
</script>

<style lang="scss">
.widget-wrapper {
  max-height: 350px;
  background-color: var(--app-surface-color);
  padding: 24px;
  border-radius: 12px;
}
.widget-wrapper--higher {
  // 24px is a gap between widgets
  max-height: 724px;
}
.widget-wrapper__header {
  margin-bottom: 12px;
}
.widget-wrapper__header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
