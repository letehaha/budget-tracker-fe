<!-- eslint-disable vuejs-accessibility/aria-role -->
<template>
  <div
    :class="{
      'select-field--disabled': disabled,
      'select-field--active': isDropdownOpened,
    }"
    role="select"
    :aria-disabled="disabled"
    class="select-field"
  >
    <template v-if="label">
      <FieldLabel :label="label" />
    </template>

    <div v-click-outside="closeDropdown" class="select-field__wrapper">
      <button
        v-bind="$attrs"
        ref="buttonRef"
        type="button"
        :disabled="disabled"
        class="button-style-reset select-field__input"
        :title="modelValue ? getLabelFromValue(modelValue as T) : placeholder"
        @click="toggleDropdown"
      >
        {{ modelValue ? getLabelFromValue(modelValue as T) : placeholder }}
        <div class="select-field__arrow" />
      </button>

      <dropdown
        :is-visible="isDropdownOpened"
        :values="dropdownValues"
        :label-key="String(labelKey)"
        :selected-value="(modelValue as T)"
        @select="selectItem"
      >
        <template #header>
          <template v-if="withSearchField">
            <div class="select-field__search">
              <input-field v-model="filterQuery" placeholder="Search..." />
            </div>
          </template>
        </template>
        <template #footer>
          <template
            v-if="withSearchField && values.length && !dropdownValues.length"
          >
            <div class="select-field__no-results">No results found</div>
          </template>
        </template>
      </dropdown>
    </div>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { ref, computed, watch, onBeforeUnmount } from "vue";

import Dropdown from "@/components/common/dropdown.vue";
import FieldError from "./components/field-error.vue";
import FieldLabel from "./components/field-label.vue";
import InputField from "./input-field.vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    modelValue: T | null;
    values: T[];
    labelKey?: keyof T | ((value: T) => string) | "label";
    placeholder?: string;
    withSearchField?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    isValuePreselected?: boolean;
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    withSearchField: false,
    disabled: false,
    errorMessage: undefined,
    isValuePreselected: false,
    labelKey: "label",
  },
);

const emit = defineEmits<{
  "update:model-value": [value: T];
  "update:isDropdownOpen": [value: boolean];
}>();

const isDropdownOpened = ref(false);
const filterQuery = ref("");
const buttonRef = ref<HTMLButtonElement>(null);

const getLabelFromValue = (value: T): string => {
  const { labelKey } = props;

  if (typeof labelKey === "function") return labelKey(value);

  return value[labelKey];
};
const dropdownValues = computed(() =>
  props.values.reduce((acc: T[], curr) => {
    if (props.withSearchField && filterQuery.value) {
      const query = filterQuery.value.toLocaleLowerCase();
      const value = String(getLabelFromValue(curr)).toLocaleLowerCase();

      if (value.includes(query)) {
        acc.push(curr);
      }
    } else {
      acc.push(curr);
    }
    return acc;
  }, []),
);
const toggleDropdown = () => {
  if (!props.disabled) {
    isDropdownOpened.value = !isDropdownOpened.value;
    emit("update:isDropdownOpen", isDropdownOpened.value);
  }
};
const closeDropdown = () => {
  if (isDropdownOpened.value) {
    isDropdownOpened.value = false;
    buttonRef.value.focus();
  }
};
const handleEscPress = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
};

watch(isDropdownOpened, (value) => {
  if (value) {
    document.addEventListener("keydown", handleEscPress);
  } else {
    document.removeEventListener("keydown", handleEscPress);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscPress);
});

const selectItem = ({ index }: { index: number }) => {
  const { disabled } = props;

  if (!disabled) {
    emit("update:model-value", dropdownValues.value[index]);
    closeDropdown();
    filterQuery.value = "";
  }
};
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
.select-field__arrow {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 11px);
  right: 10px;

  &:after,
  &:before {
    content: "";
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
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
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
