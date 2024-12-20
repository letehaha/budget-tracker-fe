<template>
  <div>
    <template v-if="label">
      <FieldLabel :label="label" />
    </template>

    <div>
      <Select.Select v-model="selectedKey" :disabled="disabled" @update:open="selectOpen">
        <Select.SelectTrigger class="w-full">
          <Select.SelectValue :placeholder="placeholder">
            {{ selectedValue ? getLabelFromValue(selectedValue) : placeholder }}
          </Select.SelectValue>
        </Select.SelectTrigger>
        <Select.SelectContent>
          <div class="p-2">
            <input-field v-model="searchQuery" type="text" placeholder="Search..." @keydown.stop />
          </div>

          <div class>
            <Select.SelectItem
              v-for="item in filteredValues"
              :key="getKeyFromItem(item)"
              :value="getKeyFromItem(item)"
            >
              {{ getLabelFromValue(item) }}
            </Select.SelectItem>
          </div>
          <slot name="select-bottom-content" />
        </Select.SelectContent>
      </Select.Select>
    </div>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { computed, nextTick, ref } from "vue";
import * as Select from "@/components/lib/ui/select";
import InputField from "@/components/fields/input-field.vue";

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

const keydownHandler = (event: KeyboardEvent) => {
  if (/^[a-zA-Z0-9]$/.test(event.key)) {
    event.stopPropagation();
    event.preventDefault();
  }
};

const selectOpen = () => {
  const el = document.querySelector("[data-radix-select-viewport]");
  if (el) {
    el.addEventListener("keydown", (event) => {
      keydownHandler(event as KeyboardEvent);
    });
  } else {
    selectOpen();
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

const filteredValues = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return propsValue.value.filter((item) => getLabelFromValue(item).toLowerCase().includes(query));
});
</script>
