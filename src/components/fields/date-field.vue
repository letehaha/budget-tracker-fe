<template>
  <div
    :class="{
      'date-field--error': errorMessage,
      'date-field--disabled': $attrs.disabled,
    }"
    class="w-full date-field"
  >
    <Popover.Popover>
      <FieldLabel :label="label">
        <Popover.PopoverTrigger class="w-full">
          <div
            :class="
              cn(
                'datetime-local-raw-input',
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                $attrs.class ?? '',
              )
            "
          >
            {{ format(localValue, "MM.dd.yyyy, HH:mm:ss") }}
          </div>
          <FieldError :error-message="errorMessage" />
        </Popover.PopoverTrigger>
        <Popover.PopoverContent class="w-[350px]">
          <Calendar v-model="localValue" mode="dateTime" is24hr type="single" />
        </Popover.PopoverContent>
      </FieldLabel>
    </Popover.Popover>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import * as Popover from "@/components/lib/ui/popover";
import { Calendar } from "@/components/lib/ui/calendar";
import { FieldLabel, FieldError } from "@/components/fields";
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    modelValue?: Date;
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

const emit = defineEmits(["update:modelValue"]);
const localValue = ref(props.modelValue);

watch(localValue, () => {
  emit("update:modelValue", localValue);
});
</script>

<style lang="scss">
.date-field {
  position: relative;
  width: 100%;
  flex: 1;
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
