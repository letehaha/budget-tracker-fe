<template>
  <div
    :class="{
      'input-field--error': errorMessage,
      'input-field--disabled': $attrs.disabled,
    }"
    class="input-field"
  >
    <FieldLabel :label="label">
      <template #label-right>
        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </template>

      <input
        v-bind="computedAttrs"
        :type="type"
        :value="modelValue"
        :style="inputFieldStyles"
        :disabled="customDisabled"
        :tabindex="tabindex"
        :min="minValue"
        :class="{'input-disabled': customDisabled}"
        class="input-field__input"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      >
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
    customDisabled: { type: Boolean, default: false },
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

        if (props.modelValue === value) return;
        if (props.type === 'number') value = Number(value);

        emit(MODEL_EVENTS.input, value);
      },
      onkeypress: (event: KeyboardEvent) => {
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

    return {
      minValue,
      computedAttrs,
      isSubLabelExist,
    };
  },
});
</script>

<style lang="scss">
.input-field {
  position: relative;
  width: 100%;
  flex: 1;
}
.input-disabled {
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
</style>
