<template>
  <div
    :class="{
      'category-select-field--disabled': $attrs.disabled,
      'category-select-field--active': isDropdownOpened
    }"
    class="category-select-field"
  >
    <FieldLabel
      :label="label"
      only-template
    >
      <div
        class="category-select-field__wrapper"
      >
        <div
          v-bind="$attrs"
          class="category-select-field__input"
          @click="() => toggleDropdown()"
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
            <!-- Show top parent category at the top of list of child categories -->
            <template v-if="previousLevelsIndices.length">
              <button
                type="button"
                class="category-select-field__dropdown-back-level"
                @click="backLevelUp"
              >
                <ChevronLeftIcon />
                Previous level
              </button>
              <button
                type="button"
                class="category-select-field__dropdown-item"
                :class="{
                  'category-select-field__dropdown-item--highlighed': selectedValue.id === topLevelCategory.id
                }"
                @click="selectItem(topLevelCategory, true)"
              >
                {{ topLevelCategory.name }}
              </button>

              <h3 class="category-select-field__dropdown-subcategories-title">
                Subcategories
              </h3>
            </template>

            <!-- Show list of categories -->
            <template
              v-for="item in levelValues"
              :key="item.id"
            >
              <button
                class="category-select-field__dropdown-item"
                type="button"
                :class="{
                  'category-select-field__dropdown-item--highlighed': selectedValue.id === item.id,
                }"
                @click="selectItem(item)"
              >
                {{ item.name }}

                <template v-if="item.subCategories.length">
                  <div class="category-select-field__dropdown-child-amount">
                    <span>({{ item.subCategories.length }})</span>
                    <ChevronRightIcon />
                  </div>
                </template>
              </button>
            </template>
          </div>
        </div>
      </div>
    </FieldLabel>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import { CategoryModel } from 'shared-types';
import {
  defineComponent, ref, Ref, computed, ComputedRef, PropType,
} from 'vue';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?component';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?component';

import FieldError from './components/field-error.vue';
import FieldLabel from './components/field-label.vue';

enum EVENTS {
  input = 'update:modelValue',
}

export const POSITIONS = Object.freeze({
  bottom: 'bottom',
  top: 'top',
});

export default defineComponent({
  components: {
    FieldError,
    FieldLabel,
    ChevronRightIcon,
    ChevronLeftIcon,
  },
  props: {
    label: { type: String, default: undefined },
    modelValue: {
      type: Object as PropType<CategoryModel>,
      default: undefined,
    },
    values: {
      type: Array as PropType<CategoryModel[]>,
      required: true,
    },
    labelKey: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    errorMessage: { type: String, default: undefined },
    position: { type: String, default: POSITIONS.bottom },
  },
  setup(props, { emit }) {
    const selectedValue = ref(props.modelValue || props.values[0]);
    // not sure why it works only using `as`
    const levelValues = ref<CategoryModel[]>(props.values);

    const isDropdownOpened = ref(false);
    const previousLevelsIndices: Ref<number[]> = ref([]);

    const topLevelCategory: ComputedRef<CategoryModel> = computed(() => {
      /**
       * If we are in a category's subcategories list, finds the subcategories
       * parent category to show it in the UI
       */
      let category;
      for (let i = 0; i < previousLevelsIndices.value.length; i++) {
        if (i === 0) {
          category = props.values[previousLevelsIndices.value[i]];
        } else {
          category = category[previousLevelsIndices.value[i]];
        }
      }
      return category;
    });

    const toggleDropdown = (state?: boolean) => {
      isDropdownOpened.value = state ?? !isDropdownOpened.value;
    };

    const definePreviousLevelsIndices = (selectedItem: CategoryModel) => {
      // push to `previousLevelsIndices` index of selecteItem so we will have
      // history of parent categories with which we can move through the history
      // of previous categories
      previousLevelsIndices.value.push(levelValues.value.findIndex(
        item => item.id === selectedItem.id,
      ));
    };

    const selectItem = (item: CategoryModel, ignorePreselect = false) => {
      /**
       * If item has child categories, it goes level deeper. `ignorePreselect`
       * will disable diving level deeper and will select category even if it
       * has child categories
       */
      if (item.subCategories.length && !ignorePreselect) {
        definePreviousLevelsIndices(item);
        levelValues.value = item.subCategories;
      } else {
        selectedValue.value = item;
        emit(EVENTS.input, item);
        toggleDropdown(false);
      }
    };
    const backLevelUp = () => {
      /**
       * Uses `previousLevelsIndices` to navigate through the history and make
       * previous level as the current one.
       *
       * At the end clears `previousLevelsIndices` by removing the last element
       * in the history.
       */
      let level;
      for (let i = 0; i < previousLevelsIndices.value.length; i++) {
        if (i === 0) {
          level = props.values;
        } else {
          level = level[previousLevelsIndices.value[i - 1]].subCategories;
        }
      }
      previousLevelsIndices.value.length -= 1;
      levelValues.value = level;
    };

    return {
      isDropdownOpened,
      selectedValue,
      levelValues,
      previousLevelsIndices,
      topLevelCategory,

      toggleDropdown,
      selectItem,
      definePreviousLevelsIndices,
      backLevelUp,
    };
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
  padding: 16px 20px;
  color: var(--app-on-surface-color);
  background-color: var(--app-surface-color);
  border: 1px solid var(--app-on-surface-color);
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
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
  background-color: var(--app-surface-color);
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
  background-color: var(--app-surface-color);
  font-size: 14px;
  line-height: 1.2;
  color: var(--app-on-surface-color);
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  position: relative;

  &--highlighed {
    background-color: rgba(var(--app-on-surface-color-rgb), 0.05);
  }

  &:hover {
    background-color: rgba(var(--app-on-surface-color-rgb), 0.05);
  }
}
.category-select-field__dropdown-subcategories-title {
  font-weight: 500;
  font-size: 16px;
  color: var(--app-on-surface-color);
  margin: 16px 0 8px 16px;
}
.category-select-field__dropdown-child-amount {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--app-on-surface-color);

  span {
    margin-right: 8px;
  }

  svg {
    width: 12px;
  }
}
.category-select-field__dropdown-back-level {
  margin: 8px 16px 16px;
  border: none;
  color: var(--primary-500);
  cursor: pointer;
  background-color: transparent;

  &:hover {
    svg {
      transform: translateX(-5px);
    }
  }

  svg {
    transition: .3s ease-out;

    width: 12px;
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

  .category-select-field--active & {
    &:before { transform: rotate(45deg); }
    &:after { transform: rotate(-45deg); }
  }
}
</style>
