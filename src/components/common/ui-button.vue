<template>
  <button
    :type="type"
    :class="[
      `button button--${size} button--${theme}`,
      {
        'button--disabled': disabled,
      }
    ]"
    :disabled="disabled"
    @click="$emit(EVENTS.click)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

enum EVENTS {
  click = 'click',
}

export type SIZES = 'default' | 'small';
export type BUTTON_THEMES = 'primary' | 'danger' | 'outline' | 'text' | 'light-dark';
export type BUTTON_TYPES = 'button' | 'submit' | 'reset';

export default defineComponent({
  name: 'ui-button',
  props: {
    type: {
      type: String as PropType<BUTTON_TYPES>,
      default: (): BUTTON_TYPES => 'button',
    },
    size: {
      type: String as PropType<SIZES>,
      default: (): SIZES => 'default',
    },
    theme: {
      type: String as PropType<BUTTON_THEMES>,
      default: (): BUTTON_THEMES => 'primary',
    },
    disabled: { type: Boolean, default: false },
  },
  emits: Object.values(EVENTS),
  data: () => ({
    EVENTS,
  }),
});
</script>

<style lang="scss" scoped>
$transition: box-shadow 0.2s ease-out;

.button {
  font-weight: 400;
  letter-spacing: 0.5px;
  font-size: 16px;
  line-height: 1.2;
  border: 1px solid transparent;
  border-radius: var(--system-border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  transition: .2s ease-out;

  &[disabled] {
    cursor: not-allowed;
  }
}

.button--primary {
  background-color: var(--app-buttons-default);
  border-color: var(--app-buttons-default);
  color: var(--app-text-on-primary);

  &:not([disabled]):hover {
    background-color: var(--app-buttons-hover);
    border-color: var(--app-buttons-hover);
  }
  &:active {
    background-color: var(--app-buttons-active);
    border-color: var(--app-buttons-active);
  }
  &[disabled] {
    background-color: var(--app-buttons-disabled);
    border-color: var(--app-buttons-disabled);
  }
}
.button--danger {
  background-color: var(--app-error);
  border-color: var(--app-error);
  color: var(--app-text-on-primary);

  &:not([disabled]):hover {
    background-color: var(--app-error);
    border-color: var(--app-error);
  }
  &:active {
    background-color: var(--app-error);
    border-color: var(--app-error);
  }
  &[disabled] {
    background-color: var(--app-error);
    border-color: var(--app-error);
  }
}
.button--light-dark {
  background-color: #444;
  border-color: #444;
  color: var(--app-text-on-primary);

  &:not([disabled]):hover {
    background-color: lighten(#444, 5);
    border-color: lighten(#444, 5);
  }
  &:active {
    background-color: darken(#444, 5);
    border-color: darken(#444, 5);
  }
  &[disabled] {
    opacity: .5;
  }
}
.button--outline {
  background-color: transparent;
  border-color: var(--app-buttons-default);
  color: var(--app-buttons-default);

  &:not([disabled]):hover {
    border-color: var(--app-buttons-hover);
    color: var(--app-buttons-hover);
  }
  &:active {
    border-color: var(--app-buttons-active);
    color: var(--app-buttons-active);
  }
  &[disabled] {
    border-color: var(--app-buttons-disabled);
    color: var(--app-buttons-disabled);
  }
}
.button--outline {
  background-color: transparent;
  border-color: transparent;
  color: var(--app-buttons-default);

  &:not([disabled]):hover {
    color: var(--app-buttons-hover);
  }
  &:active {
    color: var(--app-buttons-active);
  }
  &[disabled] {
    color: var(--app-buttons-disabled);
  }
}
</style>
