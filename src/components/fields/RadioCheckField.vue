<template>
  <div
    class="radio-check-field"
    :class="{
      'radio-check-field--disabled': $attrs.disabled,
    }"
    :for="id"
    :title="label"
  >
    <input
      :id="id"
      class="radio-check-field__input"
      type="checkbox"
      :checked="value"
      :placeholder="$attrs.placeholder || ''"
      :tabindex="$attrs.readonly || $attrs.readonly === ''
        ? -1
        : $attrs.tabindex"
      v-bind="$attrs"
    >
    <div class="radio-check-field__custom" />
    <p class="radio-check-field__label">
      {{ label }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: undefined },
    value: { type: [String, Boolean], required: true },
    readonly: { type: Boolean, default: false },
  },
  computed: {
    id() {
      return `radio-check-field-${this._uid}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-check-field {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  cursor: pointer;
}

.radio-check-field__input {
  position: absolute;
  height: 0;
  width: 0;
  overflow: hidden;
  left: -100vw;
}

.radio-check-field__custom {
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  flex: none;
  margin-right: 16px;
  transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
  position: relative;

  &:after,
  &:before {
    content: '';
    position: absolute;
    height: 2px;
    background-color: green;
    border-radius: 2px;
    display: none;
  }

  &:after {
    transform: rotate(-45deg);
    width: 10px;
    top: 9px;
    left: 6px;
  }

  &:before {
    transform: rotate(45deg);
    width: 5px;
    top: 10px;
    left: 4px;
  }

  .radio-check-field__input:checked + & {
    border-color: green;

    &:after,
    &:before {
      display: block;
    }
  }
}

.radio-check-field__label {
  font-weight: 400;
  font-size: 13px;
  line-height: 1.7;
  color: #000000;
}
</style>
