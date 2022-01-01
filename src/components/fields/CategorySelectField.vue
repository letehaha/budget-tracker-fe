<template>
  <div
    :class="{
      'category-select-field--disabled': $attrs.disabled,
      'category-select-field--active': isDropdownOpened
    }"
    class="category-select-field"
  >
    <span
      v-if="label"
      class="category-select-field__label"
    >
      {{ label }}
    </span>
    <div
      v-if="selectedValue"
      class="category-select-field__wrapper"
    >
      <div
        v-bind="$attrs"
        class="category-select-field__input"
        @click="toggleDropdown"
      >
        {{ selectedValue.name || placeholder }}
        <div class="category-select-field__arrow" />
      </div>
      <div
        v-if="isDropdownOpened"
        :class="`category-select-field__dropdown--${position}`"
        class="category-select-field__dropdown"
      >
        <div class="category-select-field__dropdown-values">
          <template v-if="previousLevel.length">
            <button
              class="category-select-field__dropdown-back-level"
              @click="backLevelUp"
            >
              Back to prev level
            </button>
            <button
              class="category-select-field__dropdown-item"
              :class="{
                'category-select-field__dropdown-item--highlighed': selectedValue.id === topLevelCategory.id
              }"
              @click="selectItem(topLevelCategory, true)"
            >
              {{ topLevelCategory.name }}
            </button>
          </template>
          <template
            v-for="item in levelValues"
            :key="item.id"
          >
            <button
              class="category-select-field__dropdown-item"
              :class="{
                'category-select-field__dropdown-item--highlighed': selectedValue.id === item.id
              }"
              @click="selectItem(item)"
            >
              {{ item.name }}
            </button>
          </template>
        </div>
      </div>
    </div>
    <p
      v-if="errorMessage"
      class="category-select-field__err-mes"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const MODEL_EVENTS = {
  input: 'update:modelValue',
};

export const POSITIONS = Object.freeze({
  bottom: 'bottom',
  top: 'top',
});

export default defineComponent({
  props: {
    label: { type: String, default: undefined },
    modelValue: { type: [Object, String], default: undefined },
    values: { type: [Array, Object], required: true },
    labelKey: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    withSearchField: { type: Boolean, default: false },
    errorMessage: { type: String, default: undefined },
    position: { type: String, default: POSITIONS.bottom },
    isValuePreselected: { type: Boolean, default: false },
  },
  data: () => ({
    isDropdownOpened: false,
    selectedValue: null,
    filterQuery: '',
    levelValues: null,
    previousLevel: [], // list of levels indices
  }),
  computed: {
    topLevelCategory() {
      let category;
      for (let i = 0; i < this.previousLevel.length; i++) {
        if (i === 0) {
          category = this.values[this.previousLevel[i]];
        } else {
          category = category[this.previousLevel[i]];
        }
      }
      return category;
    },
  },
  created() {
    this.levelValues = this.values;
    this.selectedValue = this.modelValue;
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpened = !this.isDropdownOpened;
    },
    closeDropdown() {
      this.isDropdownOpened = false;
    },
    selectItem(item, ignorePreselect = false) {
      if (item.subCategories.length && !ignorePreselect) {
        this.definePreviousLevel(item);
        this.levelValues = item.subCategories;
      } else {
        this.selectedValue = item;
        this.$emit(MODEL_EVENTS.input, item);
        this.closeDropdown();
      }
    },
    definePreviousLevel(selectedItem) {
      this.previousLevel.push(this.levelValues.findIndex(
        item => item.id === selectedItem.id,
      ));
    },
    backLevelUp() {
      let level;
      for (let i = 0; i < this.previousLevel.length; i++) {
        if (i === 0) {
          level = this.values;
        } else {
          level = level[this.previousLevel[i - 1]].subCategories;
        }
      }
      this.previousLevel.length -= 1;
      this.levelValues = level;
    },
  },
});
</script>

<style lang="scss">
.category-select-field {
  position: relative;
  width: 100%;
  flex: 1;
}
.category-select-field__input {
  font-size: 16px;
  line-height: 1;
  color: #333333;
  padding: 16px 20px;
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  box-sizing: border-box;
  border-radius: 4px;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.category-select-field__label {
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  color: #333333;
  margin-bottom: 10px;
  display: block;
}
.category-select-field__wrapper {
  position: relative;
}
.category-select-field__dropdown {
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  visibility: hidden;
  opacity: 0;
  padding: 8px 0;
  transition: 0.2s ease-out;
  background-color: #ecf0f1;
  box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.08);
  z-index: var(--z-category-select-field);
  border-radius: 4px;

  .category-select-field--active & {
    visibility: visible;
    opacity: 1;
  }
}
.category-select-field__dropdown-values {
  overflow: auto;
  max-height: 250px;
}
.category-select-field__dropdown-item {
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease-out;
  border: none;
  background-color: #ecf0f1;
  font-size: 14px;
  line-height: 1.2;
  color: #333333;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &--highlighed {
    background-color: #dbe1e2;
  }

  &:hover {
    background-color: #dbe1e2;
  }
}
.category-select-field__arrow {
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
    background-color: #000000;
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

  .category-select-field--active & {
    &:before { transform: rotate(45deg); }
    &:after { transform: rotate(-45deg); }
  }
}
.category-select-field__err-mes {
  color: red;
  font-size: 12px;
}
</style>
