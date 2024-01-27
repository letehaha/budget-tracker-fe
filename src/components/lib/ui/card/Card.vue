<script setup lang="ts">
import { useAttrs } from "vue";
import { cn } from "@/lib/utils";

const attrs = useAttrs();
withDefaults(
  defineProps<{
    as?: "div" | "form";
  }>(),
  {
    as: "div",
  },
);
</script>

<template>
  <component
    :is="as"
    :class="
      cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        attrs.class,
      )
    "
  >
    <slot />
  </component>
</template>
