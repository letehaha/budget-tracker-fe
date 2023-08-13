<template>
  <div
    class="text-field"
    :class="{
      'text-field--error': errorMessage,
      'text-field--disabled': disabled,
      'text-field--readonly': readonly,
      'text-field--dirty': hasValue,
    }
    "
  >
    <FieldLabel :label="label">
      <template #label-right>
        <template v-if="$slots['label-right']">
          <slot name="label-right" />
        </template>
      </template>

      <textarea
        class="text-field__input"
        :placeholder="placeholder || ''"
        :value="modelValue"
        :disabled="disabled"
        :name="name"
        :autofocus="autofocus"
        :maxlength="maxlength"
        :required="required"
        :readonly="readonly"
        :title="title"
        :rows="rows"
        :cols="cols"
        @input="onInput"
      />
    </FieldLabel>

    <span
      v-if="maxlength"
      class="text-field__length"
    >
      {{ `${currentLength}/${maxlength}` }}
    </span>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FieldLabel from './components/field-label.vue';
import FieldError from './components/field-error.vue';

const MODEL_EVENTS = Object.freeze({
  input: 'update:modelValue',
});

export default defineComponent({
  components: {
    FieldLabel,
    FieldError,
  },
  props: {
    label: { type: String, default: undefined },
    modelValue: { type: [String, Number], default: undefined },
    errorMessage: { type: String, default: undefined },
    // proxies
    autocomplete: { type: String, default: 'off' },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    maxlength: { type: [String, Number], default: undefined },
    // textarea proxies
    rows: { type: [String, Number], default: 4 },
    cols: { type: [String, Number], default: undefined },
  },
  data: () => ({
    currentLength: '0',
  }),
  computed: {
    hasValue() {
      return Boolean(this.modelValue);
    },
  },
  mounted() {
    if (this.modelValue) this.currentLength = String(this.modelValue).length;
  },
  methods: {
    onInput(event) {
      if (this.maxlength) this.currentLength = event.target.value.length;
      this.$emit(MODEL_EVENTS.input, event.target.value);
    },
  },
});
</script>

<style lang="scss">
.text-field {
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    filter: grayscale(100%);
    border-style: dashed;
  }
}

.text-field__input {
  width: 100%;
  position: relative;
  padding: 16px 16px 24px;
  caret-color: var(--app-on-surface-color);
  background-color: var(--app-surface-color);
  border: 1px solid var(--app-on-surface-color);
  border-radius: 4px;
  transition: all 0s, border-color 0.2s ease-out;
  resize: none;
  color: var(--app-on-surface-color);

  @include placeholder-custom(rgba(var(--app-on-surface-color-rgb), 0.4));
}
</style>
