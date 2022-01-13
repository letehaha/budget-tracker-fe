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

const EVENTS = {
  click: 'click',
};

export const THEMES = Object.freeze({
  blue: 'blue',
});

export const SIZES = Object.freeze({
  large: 'large',
  default: 'default',
});

enum BUTTON_TYPES {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}

export default defineComponent({
  props: {
    type: { type: String as PropType<BUTTON_TYPES>, default: 'button' },
    disabled: { type: Boolean, default: false },
    size: {
      type: String,
      default: SIZES.default,
      validator: (size: string) => Object.values(SIZES).includes(size),
    },
    theme: {
      type: String,
      default: THEMES.blue,
      validator: (theme: string) => Object.values(THEMES).includes(theme),
    },
    withShadow: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    isText: { type: Boolean, default: false },
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
}

.button--blue {
  background-color: var(--primary-500);
  color: #fff;

  &:hover {
    background-color: var(--primary-700);
  }
  &:active {
    background-color: var(--primary-600);
  }
  &[disabled] {
    background-color: var(--primary-200);
    cursor: not-allowed;
  }
  &:not([disabled]).button--outline {
    background-color: transparent;
    border-color: var(--primary-500);
    color: var(--primary-500);
  }
}
</style>
