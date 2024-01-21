<template>
  <label
    :class="{
      'tick-field--disabled': attrs.disabled,
    }"
    :for="id"
    :title="label"
    class="tick-field"
  >
    <input
      :id="id"
      :checked="modelValue"
      :placeholder="attrs.placeholder || ''"
      v-bind="attrs"
      class="tick-field__input"
      type="checkbox"
    />
    <div class="tick-field__custom" />
    <p class="tick-field__label">
      {{ label }}
    </p>
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const MODEL_EVENTS = {
  input: "update:modelValue",
};

export default defineComponent({
  props: {
    label: { type: String, default: undefined },
    modelValue: { type: [String, Boolean], required: true },
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        onInput: (event) => {
          this.$emit(MODEL_EVENTS.input, event.target.checked);
        },
      };
    },
    id() {
      return `tick-field-${this._uid}`;
    },
  },
});
</script>

<style lang="scss">
.tick-field {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  cursor: pointer;
}

.tick-field__input {
  position: absolute;
  height: 0;
  width: 0;
  overflow: hidden;
  left: -100vw;
}

.tick-field__custom {
  background-color: transparent;
  border: 1px solid #000000;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  flex: none;
  margin-right: 16px;
  transition:
    background-color 0.2s ease-out,
    border-color 0.2s ease-out;
  position: relative;
  margin-top: 4px;

  &:after,
  &:before {
    content: "";
    position: absolute;
    height: 2px;
    background-color: #ffffff;
    border-radius: 2px;
    display: none;
  }

  &:after {
    transform: rotate(-45deg);
    width: 10px;
    top: 8px;
    left: 6px;
  }

  &:before {
    transform: rotate(45deg);
    width: 5px;
    top: 9px;
    left: 4px;
  }

  .tick-field__input:checked + & {
    background-color: var(--app-danger-color);
    border-color: var(--app-danger-color);

    &:after,
    &:before {
      display: block;
    }
  }
}

.tick-field__label {
  font-weight: 400;
  font-size: 16px;
  line-height: 1.7;
  color: #000000;

  .tick-field__input:checked ~ & {
    color: #ffffff;
  }
}
</style>
