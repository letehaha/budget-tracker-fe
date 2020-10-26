<template>
  <button
    :type="type"
    :class="[
      `button button--${size} button--${theme}`,
      {
        'button--disabled': disabled,
        'button--outline': outline,
        'button--has-hover': withHover,
      }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export const THEMES = Object.freeze({
  blue: 'blue',
});

export const SIZES = Object.freeze({
  large: 'large',
});

export default {
  props: {
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    size: {
      type: String,
      default: SIZES.large,
      validator: size => Object.values(SIZES).includes(size),
    },
    theme: {
      type: String,
      default: THEMES.blue,
      validator: theme => Object.values(THEMES).includes(theme),
    },
    withShadow: { type: Boolean, default: false },
    withHover: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    isText: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
$transition: box-shadow 0.2s ease-out;

.button {
  font-weight: 700;
  font-size: 17px;
  line-height: 1.2;
  border: 1px solid transparent;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
  transition: $transition;

  /* @include respond-to-custom-width(550px) {
    font-size: 14px;
  } */

  &.button--has-hover {
    transition: $transition, transform 0.2s ease-out;

    &:hover {
      transform: scale(1.02);
    }
  }
}

.button--large {
  padding: 16px 34px;
}

.button--blue {
  background-color: blue;

  &:not(.button--disabled).button--outline {
    background-color: transparent;
    border-color: blue;
    color: blue;
  }

  &.button--disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}
</style>
