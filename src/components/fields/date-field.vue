<template>
  <div
    :class="{
      'date-field--error': errorMessage,
      'date-field--disabled': $attrs.disabled
    }"
    class="date-field"
  >
    <FieldLabel :label="label">
      <template #label-right>
        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </template>

      <input
        v-bind="computedAttrs"
        type="datetime-local"
        :value="modelValue"
        :style="inputFieldStyles"
        :tabindex="tabindex"
        class="date-field__input"
      >
    </FieldLabel>

    <div
      v-if="isSubLabelExist"
      class="date-fields__sublabel"
    >
      <slot name="subLabel" />
    </div>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import FieldLabel from './components/field-label.vue';
import FieldError from './components/field-error.vue';

export const MODEL_EVENTS = {
  input: 'update:modelValue',
};

export default defineComponent({
  components: {
    FieldLabel,
    FieldError,
  },
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
    };

    const isSubLabelExist = computed(() => !!slots.subLabel);

    return {
      computedAttrs,
      isSubLabelExist,
    };
  },
});
</script>

<style lang="scss">
.date-field {
  position: relative;
  width: 100%;
  flex: 1;
}
.date-field__input {
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
  width: 100%;

  @include placeholder-custom(rgba(var(--app-on-surface-color-rgb), 0.6));

  &::-webkit-calendar-picker-indicator {
    opacity: 1;
    display: block;
    background: url('@/assets/icons/colored/calendar-black.svg') no-repeat;
    width: 18px;
    height: 18px;
    margin-top: -2px;

    body.dark & {
      background: url('@/assets/icons/colored/calendar-white.svg') no-repeat;
    }
}
}
.date-fields__sublabel {
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
