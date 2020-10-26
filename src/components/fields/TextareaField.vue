<template>
  <div
    class="text-field"
    :class="{
      'text-field--error': errorMessage,
      'text-field--disabled': disabled,
      'text-field--readonly': readonly,
      'text-field--dirty': hasValue
    }
    "
  >
    <span
      class="text-field__label"
      :class="{'text-field__label--hidden': !label}"
    >
      {{ label }}
    </span>

    <textarea
      class="text-field__input"
      :placeholder="placeholder || ''"
      :value="value"
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

    <span
      v-if="maxlength"
      class="text-field__length"
    >
      {{ `${currentLength}/${maxlength}` }}
    </span>

    <p
      v-if="errorMessage"
      class="text-field__err-mes"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
const EVENTS = Object.freeze({
  input: 'input',
});

export default {
  props: {
    label: { type: String, default: undefined },
    value: { type: [String, Number], default: undefined },
    errorMessage: { type: String, default: undefined },
    // proxies
    autocomplete: { type: String, default: 'off' },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    title: { type: [String, Number], default: undefined },
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
      return Boolean(this.value);
    },
  },
  mounted() {
    if (this.value) this.currentLength = String(this.value).length;
  },
  methods: {
    onInput(event) {
      if (this.maxlength) this.currentLength = event.target.value.length;
      this.$emit(EVENTS.input, event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
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

.text-field__label {
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.2;
  color: #000000;
}

.text-field__input {
  width: 100%;
  position: relative;
  padding: 16px 16px 24px;
  caret-color: #000000;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 4px;
  transition: all 0s, border-color 0.2s ease-out;
  resize: none;
  outline: none;
  color: #000000;

  @include placeholder-custom(rgba(#000000, 0.4));
}

.text-field__err-mes {
  color: red;
  font-size: 12px;
}
</style>
