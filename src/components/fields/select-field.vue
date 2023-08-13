<template>
  <div
    :class="{
      'select-field--disabled': disabled,
      'select-field--active': isDropdownOpened,
    }"
    class="select-field"
  >
    <template v-if="label">
      <FieldLabel :label="label" />
    </template>

    <div
      v-click-outside="closeDropdown"
      class="select-field__wrapper"
    >
      <div
        v-bind="$attrs"
        class="select-field__input"
        :title="selectedValue"
        @click="toggleDropdown"
      >
        {{ selectedValue || placeholder }}
        <div class="select-field__arrow" />
      </div>
      <div
        v-if="isDropdownOpened"
        :class="`select-field__dropdown--${position}`"
        class="select-field__dropdown"
      >
        <template v-if="withSearchField">
          <div class="select-field__search">
            <input-field
              v-model="filterQuery"
              placeholder="Search..."
            />
          </div>
        </template>
        <div class="select-field__dropdown-values">
          <template
            v-for="(item, i) in labels"
            :key="item"
          >
            <button
              type="button"
              :class="{
                'select-field__dropdown-item--highlighed':
                  selectedValue === item,
              }"
              class="select-field__dropdown-item"
              @click="selectItem(i)"
            >
              {{ item }}
            </button>
          </template>
        </div>
        <template v-if="withSearchField && values.length && !labels.length">
          <div class="select-field__no-results">
            No results found
          </div>
        </template>
      </div>
    </div>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FieldError from './components/field-error.vue';
import FieldLabel from './components/field-label.vue';
import InputField from './input-field.vue';

enum MODEL_EVENTS {
  input = 'update:model-value',
}

export const POSITIONS = Object.freeze({
  bottom: 'bottom',
  top: 'top',
});

export default defineComponent({
  components: {
    FieldError,
    FieldLabel,
    InputField,
  },
  props: {
    label: { type: String, default: undefined },
    modelValue: { type: [Object, String], default: undefined },
    values: { type: [Array, Object], required: true },
    labelKey: { type: [String, Function], default: undefined },
    placeholder: { type: String, default: undefined },
    withSearchField: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    errorMessage: { type: String, default: undefined },
    position: { type: String, default: POSITIONS.bottom },
    isValuePreselected: { type: Boolean, default: false },
  },
  data: () => ({
    isDropdownOpened: false,
    selectedValue: null,
    filterQuery: '',
  }),
  computed: {
    labels(): string[] {
      if (Array.isArray(this.values[0])) {
        if (this.withSearchField && this.filterQuery) {
          return this.values.filter(
            str => str.toLowerCase()
              .search(this.filterQuery.toLowerCase()) > -1,
          );
        }
        return this.values;
      }

      if (typeof this.values[0] === 'object' && this.values[0] !== null) {
        const values = this.values.map(obj => this.getLabelFromValue(obj));

        if (this.withSearchField && this.filterQuery) {
          return values.filter(
            str => str.toLowerCase()
              .search(this.filterQuery.toLowerCase()) > -1,
          );
        }
        return values;
      }

      if (this.withSearchField && this.filterQuery) {
        return this.values.filter(
          str => str.toLowerCase().search(this.filterQuery.toLowerCase()) > -1,
        );
      }
      return this.values;
    },
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value) {
          if (typeof this.values[0] === 'object' && this.values[0] !== null) {
            this.selectedValue = this.getLabelFromValue(value);
          } else {
            this.selectedValue = value;
          }
        } else if (value === null) {
          this.selectedValue = null;
        } else if (value === undefined && this.isValuePreselected) {
          this.selectItem(0);
        }
      },
    },
    values: {
      handler() {
        if (this.modelValue) {
          const modelValueLabel = this.getLabelFromValue(this.modelValue);

          if (
            !this.values.find(
              item => this.getLabelFromValue(item) === modelValueLabel,
            )
          ) {
            this.$emit(MODEL_EVENTS.input, this.values[0]);
          }
        }
      },
    },
  },
  methods: {
    toggleDropdown() {
      if (!this.disabled) {
        this.isDropdownOpened = !this.isDropdownOpened;
      }
    },
    closeDropdown() {
      this.isDropdownOpened = false;
    },
    selectItem(index) {
      if (!this.disabled) {
        this.selectedValue = this.labels[index];
        if (this.labels.length === this.values.length) {
          this.$emit(MODEL_EVENTS.input, this.values[index]);
        } else {
          const matchLabelToItem = this.values.find(
            item => this.getLabelFromValue(item) === this.labels[index],
          );
          this.$emit(MODEL_EVENTS.input, matchLabelToItem);
        }
        this.filterQuery = '';
        this.closeDropdown();
      }
    },
    getLabelFromValue(value) {
      if (!this.labelKey) return value.label;

      if (typeof this.labelKey === 'function') return this.labelKey(value);

      return value[this.labelKey];
    },
  },
});
</script>

<style lang="scss">
.select-field {
  position: relative;
  width: 100%;
  flex: 1;
}

.select-field__input {
  font-size: 16px;
  line-height: 1;
  color: var(--app-on-surface-color);
  padding: 16px 20px;
  background-color: var(--app-surface-color);
  border: 1px solid #bdc3c7;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .select-field--disabled & {
    opacity: 0.3;
    cursor: initial;
  }
}

.select-field__wrapper {
  position: relative;
}

.select-field__dropdown {
  @include dropdown-shadow();

  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  visibility: hidden;
  opacity: 0;
  padding: 8px 0;
  transition: 0.2s ease-out;
  background-color: var(--app-surface-color);
  z-index: var(--z-select-field);
  border-radius: 4px;

  .select-field--active & {
    visibility: visible;
    opacity: 1;
  }
}

.select-field__dropdown-values {
  overflow: auto;
  max-height: 200px;
}

.select-field__dropdown-item {
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease-out;
  border: none;
  background-color: var(--app-surface-color);
  font-size: 14px;
  line-height: 1.2;
  color: var(--app-on-surface-color);
  padding: 16px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &--highlighed {
    background-color: var(--app-bg-color);
  }

  &:hover {
    background-color: var(--app-bg-color);
  }
}

.select-field__arrow {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 11px);
  right: 10px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 2px;
    background-color: var(--app-on-surface-color);
    border-radius: 2px;
    transform: rotate(45deg);
    top: 10px;
    left: inherit;
    transition: transform 0.15s ease-out;
  }

  &:before {
    left: 5px;
    transform: rotate(-45deg);
  }

  .select-field--active & {
    &:before { transform: rotate(45deg); }
    &:after { transform: rotate(-45deg); }
  }
}
.select-field__search {
  padding: 0 8px 8px;
}
.select-field__no-results {
  padding: 8px 16px;
  font-size: 14px;
}
</style>
