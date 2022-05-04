<template>
  <div
    :class="{
      'input-field--error': errorMessage,
      'input-field--disabled': $attrs.disabled
    }"
    class="input-field"
  >
    <label class="input-field__input-focusable">
      <template v-if="label">
        <div class="input-field__label">
          <span>{{ label }}</span>

          <template v-if="$slots['label-right']">
            <slot name="label-right" />
          </template>
        </div>
      </template>
      <div class="input-field__input-wrapper">
        <input
          v-bind="computedAttrs"
          :type="type"
          :value="modelValue"
          :style="inputFieldStyles"
          :tabindex="tabindex"
          :min="minValue"
          class="input-field__input"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        >
      </div>
    </label>
    <div
      v-if="isSubLabelExist"
      class="input-fields__sublabel"
    >
      <slot name="subLabel" />
    </div>
    <p
      v-if="errorMessage"
      class="input-field__err-mes"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { KEYBOARD_CODES } from 'shared-types';
import { defineComponent, computed } from 'vue';

export const MODEL_EVENTS = {
  input: 'update:modelValue',
};

export default defineComponent({
  props: {
    label: { type: String, default: undefined },
    modelValue: { type: [String, Number], default: undefined },
    type: { type: String, default: undefined },
    tabindex: { type: String, default: undefined },
    errorMessage: { type: String, default: undefined },
    inputFieldStyles: { type: Object, default: undefined },
    onlyPositive: Boolean,
  },
  setup(props, { attrs, emit, slots }) {
    const computedAttrs = {
      ...attrs,
      onInput: event => {
        if (props.modelValue === event.target.value) return;
        emit(MODEL_EVENTS.input, event.target.value);
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
      if (attrs.min < 0) {
        return 0;
      }

      return attrs.min as number;
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
.input-field__input-wrapper {
  position: relative;
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
.input-field__label {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.5px;
  line-height: 1;
  color: var(--app-on-surface-color);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input-field__err-mes {
  color: var(--app-danger-color);
  font-size: 14px;
  margin-top: 4px;
  margin-left: 8px;
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
