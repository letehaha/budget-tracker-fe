<template>
  <div
    :class="{
      'date-field--error': errorMessage,
      'date-field--disabled': $attrs.disabled,
    }"
    class="date-field"
  >
    <FieldLabel :label="label">
      <template #label-right>
        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </template>

      <div class="date-field__wrapper">
        <input
          type="datetime-local"
          :value="modelValue"
          :disabled="$attrs.disabled as boolean"
          :style="inputFieldStyles"
          :tabindex="tabindex"
          class="date-field__input"
          v-on="computedEvents"
        />
      </div>
    </FieldLabel>

    <div v-if="isSubLabelExists" class="date-fields__sublabel">
      <slot name="subLabel" />
    </div>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import FieldLabel from "./components/field-label.vue";
import FieldError from "./components/field-error.vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    modelValue?: string | number;
    type?: string;
    tabindex?: string;
    errorMessage?: string;
    inputFieldStyles?: Record<string, string>;
  }>(),
  {
    label: undefined,
    modelValue: undefined,
    type: undefined,
    tabindex: undefined,
    errorMessage: undefined,
    inputFieldStyles: undefined,
  },
);

const slots = defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subLabel(): any;
}>();

const emit = defineEmits(["update:modelValue"]);

const computedEvents = {
  input: (event: InputEvent) => {
    const eventTarget = event.target as HTMLInputElement;
    if (props.modelValue === eventTarget.value) return;
    emit("update:modelValue", eventTarget.value);
  },
};

const isSubLabelExists = computed(() => !!slots.subLabel);
</script>

<style lang="scss">
.date-field {
  position: relative;
  width: 100%;
  flex: 1;
}
.date-field__wrapper {
  .date-field--disabled & {
    opacity: 0.3;
  }
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
    background: url("@/assets/icons/colored/calendar-black.svg") no-repeat;
    width: 18px;
    height: 18px;
    margin-top: -2px;

    body.dark & {
      background: url("@/assets/icons/colored/calendar-white.svg") no-repeat;
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
