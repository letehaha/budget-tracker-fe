<template>
  <button
    :type="type"
    :class="[
      `button button--${size} button--${theme}`,
      {
        'button--disabled': disabled,
        'button--outline': outline,
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

export enum BUTTON_THEMES {
  primary = 'primary',
  danger = 'danger',
}

export enum SIZES {
  large = 'large',
  default = 'default',
}

export enum BUTTON_TYPES {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}

export default defineComponent({
  name: 'ui-button',
  props: {
    type: { type: String as PropType<BUTTON_TYPES>, default: 'button' },
    disabled: { type: Boolean, default: false },
    size: {
      type: String,
      default: SIZES.default,
      validator: (size: SIZES) => Object.values(SIZES).includes(size),
    },
    theme: {
      type: String,
      default: BUTTON_THEMES.primary,
      validator: (t: BUTTON_THEMES) => Object.values(BUTTON_THEMES).includes(t),
    },
    outline: { type: Boolean, default: false },
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
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  transition: .2s ease-out;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.button--primary {
  background-color: var(--primary-500);
  color: #fff;

  &:not([disabled]):hover {
    background-color: var(--primary-800);
  }
  &:active {
    background-color: var(--primary-600);
  }
  &:not([disabled]).button--outline {
    background-color: transparent;
    border-color: var(--primary-500);
    color: var(--primary-500);
  }
}
.button--danger {
  background-color: var(--danger-500);
  color: #fff;

  &:not([disabled]):hover {
    background-color: var(--danger-900);
  }
  &:active {
    background-color: var(--danger-600);
  }
  &:not([disabled]).button--outline {
    background-color: transparent;
    border-color: var(--danger-500);
    color: var(--danger-500);
  }
}
</style>
