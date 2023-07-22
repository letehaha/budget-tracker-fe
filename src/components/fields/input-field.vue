<template>
  <div
    :class="{
      'input-field--error': errorMessage,
      'input-field--disabled': disabled,
    }"
    class="input-field"
  >
    <FieldLabel :label="label">
      <template #label-right>
        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </template>

      <div class="input-field__wrapper">
        <template v-if="isLeadingIconExist">
          <div class="input-field__leading-icon">
            <slot name="iconLeading" />
          </div>
        </template>

        <input
          v-bind="computedAttrs"
          :type="type"
          :value="modelValue"
          :style="inputFieldStyles"
          :disabled="disabled"
          :tabindex="tabindex"
          :min="minValue"
          class="input-field__input"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        >

        <template v-if="isTrailIconExist">
          <div class="input-field__trailing-icon">
            <slot name="iconTrailing" />
          </div>
        </template>
      </div>
    </FieldLabel>

    <template v-if="isSubLabelExist">
      <div class="input-fields__sublabel">
        <slot name="subLabel" />
      </div>
    </template>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import { KEYBOARD_CODES } from '@/common/types';
import { defineComponent, computed } from 'vue';

import FieldLabel from './components/field-label.vue';
import FieldError from './components/field-error.vue';

export const MODEL_EVENTS = {
  input: 'update:modelValue',
};

interface InputChangeEvent extends Event {
  target: HTMLInputElement;
}

export default defineComponent({
  components: {
    FieldLabel,
    FieldError,
  },
  props: {
    label: { type: String, default: undefined },
    modelValue: { type: [String, Number], default: undefined },
    type: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    tabindex: { type: String, default: undefined },
    errorMessage: { type: String, default: undefined },
    inputFieldStyles: { type: Object, default: undefined },
    onlyPositive: Boolean,
  },
  emits: {
    [MODEL_EVENTS.input]: (value: number | string) => (
      typeof value === 'number' || typeof value === 'string'
    ),
  },
  setup(props, { attrs, emit, slots }) {
    const computedAttrs = {
      ...attrs,
      onInput: (event: InputChangeEvent) => {
        let value: string | number = event.target.value;

        if (props.disabled) return;
        if (props.modelValue === value) return;
        if (props.type === 'number') value = Number(value);

        emit(MODEL_EVENTS.input, value);
      },
      onkeypress: (event: KeyboardEvent) => {
        if (props.disabled) return;

        if (props.type === 'number') {
          if (event.keyCode === KEYBOARD_CODES.keyE) {
            event.preventDefault();
          }
        }
        if (props.onlyPositive) {
          if (
            [
              KEYBOARD_CODES.minus,
              KEYBOARD_CODES.equal,
              KEYBOARD_CODES.plus,
            ].includes(event.keyCode)
          ) {
            event.preventDefault();
          }
        }
      },
    };

    const minValue = computed<number>(() => {
      if (props.onlyPositive && !attrs.min) {
        return 0;
      }
      if (Number(attrs.min) < 0) {
        return 0;
      }

      return Number(attrs.min);
    });

    const isSubLabelExist = computed(() => !!slots.subLabel);

    const isTrailIconExist = computed(() => !!slots.iconTrailing);

    const isLeadingIconExist = computed(() => !!slots.iconLeading);

    return {
      minValue,
      computedAttrs,
      isSubLabelExist,
      isTrailIconExist,
      isLeadingIconExist,
    };
  },
});
</script>

<style lang="scss">
.input-field {
  position: relative;
  width: 100%;
  flex: 1;
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
.input-field--disabled {
  opacity: 0.6;
}
.input-field__input {
  font-size: 16px;
  line-height: 1;
  color: var(--app-on-surface-color);
  font-weight: 400;
  letter-spacing: 0.5px;
  padding: 12px 24px;
  background-color: var(--app-surface-color);
  border: 1px solid #acafb3;
  box-sizing: border-box;
  border-radius: var(--system-border-radius);
  outline: none;
  width: 100%;

  @include placeholder-custom(rgba(var(--app-on-surface-color-rgb), 0.6));
}
.input-field__wrapper {
  position: relative;
}
.input-fields__sublabel {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 16px;
  font-weight: 400;
  color: rgba(var(--app-on-surface-color-rgb), 0.95);

  a {
    color: #ffffff;
    text-decoration: none;
  }
}
.input-field__leading-icon,
.input-field__trailing-icon {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px 24px;
}
</style>
