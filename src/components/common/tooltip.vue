<template>
  <div class="ui-tooltip">
    <slot />

    <template v-if="content || $refs['tooltip-content'] || $refs['tooltip-message']">
      <div class="ui-tooltip__content-wrapper">
        <slot name="tooltip-content">
          <div class="ui-tooltip__content">
            <slot name="tooltip-message">
              {{ content }}
            </slot>
          </div>
        </slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ui-tooltip',
  props: {
    content: { type: String, default: undefined },
  },
});
</script>

<style lang="scss" scoped>
.ui-tooltip {
  position: relative;
}
.ui-tooltip__content-wrapper {
  position: absolute;
  bottom: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);

  opacity: 0;
  visibility: hidden;
  transition: .2s ease-out;

  .ui-tooltip:hover & {
    opacity: 1;
    visibility: visible;
  }
}
.ui-tooltip__content {
  background-color: rgba(11, 11, 11, .98);
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 200px;
  width: max-content;
  text-align: center;
}
</style>
