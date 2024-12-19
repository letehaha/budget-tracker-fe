<template>
  <div>
    <template v-if="label">
      <FieldLabel :label="label" />
    </template>

    <Select.Select v-model="selectedKey" :disabled="disabled">
      <Select.SelectTrigger class="w-full">
        <Select.SelectValue :placeholder="placeholder">
          {{ selectedValue ? getLabelFromValue(selectedValue) : placeholder }}
        </Select.SelectValue>
      </Select.SelectTrigger>
      <Select.SelectContent>
        <slot name="select-top-content" />

        <Select.SelectItem
          v-for="item in filteredValues"
          :key="getKeyFromItem(item)"
          :value="getKeyFromItem(item)"
        >
          {{ getLabelFromValue(item) }}
        </Select.SelectItem>

        <slot name="select-bottom-content" />
      </Select.SelectContent>
    </Select.Select>

    <FieldError :error-message="errorMessage" />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { computed } from "vue";
import * as Select from "@/components/lib/ui/select";

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

const selectedValue = computed(() => props.modelValue);

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

const filteredValues = computed(() => props.values);

const selectedKey = computed({
  get: () => (selectedValue.value ? getKeyFromItem(selectedValue.value) : ""),
  set: (key: string) => {
    const newValue = props.values.find((item) => getKeyFromItem(item) === key) ?? null;
    emit("update:modelValue", newValue);
  },
});
</script>
