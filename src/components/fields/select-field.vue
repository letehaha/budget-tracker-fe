<script lang="ts" setup generic="T extends Record<string, any>">
import { computed, nextTick, ref, watch } from "vue";
import * as Select from "@/components/lib/ui/select";
import InputField from "@/components/fields/input-field.vue";

import { debounce } from "lodash-es";
import FieldError from "./components/field-error.vue";
import FieldLabel from "./components/field-label.vue";

const props = withDefaults(
  defineProps<{
    modelValue: T | null;
    values: T[];
    labelKey?: keyof T | ((value: T) => string) | "label";
    valueKey?: keyof T | ((value: T) => string | number) | "value";
    placeholder?: string;
    disabled?: boolean;
    errorMessage?: string;
    label?: string;
  }>(),
  {
    placeholder: "Select an option",
    disabled: false,
    errorMessage: undefined,
    labelKey: "label",
    valueKey: "value",
    label: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: T | null];
}>();

const searchQuery = ref("");
const selectedValue = computed(() => props.modelValue);
const isDropdownOpen = ref<boolean>(false);
const debouncedFilteredValues = ref<T[]>([]);

const keydownHandler = (event: KeyboardEvent) => {
  if (/^[a-zA-Z0-9]$/.test(event.key)) {
    event.stopPropagation();
    event.preventDefault();
  }
};

const getLabelFromValue = (value: T): string => {
  const { labelKey } = props;
  if (typeof labelKey === "function") return labelKey(value);
  return String(value[labelKey as keyof T]);
};

const getValueFromItem = (item: T): string | number => {
  const { valueKey } = props;
  if (typeof valueKey === "function") return valueKey(item);
  return item[valueKey as keyof T] as string | number;
};
const getKeyFromItem = (item: T): string => String(getValueFromItem(item));

const propsValue = computed(() => props.values);

const selectedKey = computed({
  get: () => (selectedValue.value ? getKeyFromItem(selectedValue.value) : ""),
  set: (key: string) => {
    const newValue = props.values.find((item) => getKeyFromItem(item) === key) ?? null;
    emit("update:modelValue", newValue);
  },
});

watch(
  searchQuery,
  debounce((query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    debouncedFilteredValues.value = propsValue.value.filter((item) =>
      getLabelFromValue(item).toLowerCase().includes(lowerCaseQuery),
    );
  }, 300),
);

debouncedFilteredValues.value = propsValue.value;

watch(isDropdownOpen, async () => {
  if (isDropdownOpen.value) {
    await nextTick();
    const el = document.querySelector("[data-radix-select-viewport]");
    el?.addEventListener("keydown", (event) => {
      keydownHandler(event as KeyboardEvent);
    });
  }
});
</script>

<template>
  <div>
    <template v-if="label">
      <FieldLabel :label="label" />
    </template>

    <div>
      <Select.Select
        v-model="selectedKey"
        :disabled="disabled"
        @update:open="isDropdownOpen = $event"
      >
        <Select.SelectTrigger class="w-full">
          <Select.SelectValue :placeholder="placeholder">
            {{ selectedValue ? getLabelFromValue(selectedValue) : placeholder }}
          </Select.SelectValue>
        </Select.SelectTrigger>
        <Select.SelectContent>
          <div class="p-2">
            <input-field v-model="searchQuery" type="text" placeholder="Search..." @keydown.stop />
          </div>

          <Select.SelectItem
            v-for="item in debouncedFilteredValues"
            :key="getKeyFromItem(item as T)"
            :value="getKeyFromItem(item as T)"
          >
            {{ getLabelFromValue(item as T) }}
          </Select.SelectItem>
          <slot name="select-bottom-content" />
        </Select.SelectContent>
      </Select.Select>
    </div>

    <FieldError :error-message="errorMessage" />
  </div>
</template>
