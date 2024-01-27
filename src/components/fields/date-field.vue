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
        <div class="relative">
          <input
            :value="inputValue"
            type="datetime-local"
            :class="
              cn(
                'datetime-local-raw-input',
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                $attrs.class ?? '',
              )
            "
            @input="handleLocalInputUpdate"
          />
          <Popover.PopoverTrigger as-child>
            <Button
              class="absolute top-0 right-0 flex items-center justify-center h-10"
              variant="ghost"
              size="icon"
            >
              <CalendarClockIcon :size="24" />
            </Button>
          </Popover.PopoverTrigger>
        </div>
        <FieldError :error-message="errorMessage" />
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
import { CalendarClockIcon } from "lucide-vue-next";
import { ref, watch } from "vue";
import { Button } from "@/components/lib/ui/button";

interface InputChangeEvent extends InputEvent {
  target: HTMLInputElement;
}

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

const formatToInput = (value: Date) => format(value, "yyyy-MM-dd HH:mm");

const inputValue = ref(props.modelValue ? formatToInput(props.modelValue) : "");

const emit = defineEmits<{
  (e: "update:modelValue", payload: Date): void;
}>();
const localValue = ref<Date>(props.modelValue);

const handleLocalInputUpdate = (event: InputChangeEvent) => {
  emit("update:modelValue", new Date(event.target.value));
};

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = value ? formatToInput(value) : "";
    localValue.value = value;
  },
);

watch(localValue, () => {
  emit("update:modelValue", localValue.value);
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
