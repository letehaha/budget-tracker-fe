<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaViewport,
} from "radix-vue";
import { cn } from "@/lib/utils";
import ScrollBar from "./ScrollBar.vue";

const props = withDefaults(
  defineProps<ScrollAreaRootProps & { class?: string; scrollY?: () => void }>(),
  {
    class: "",
    orientation: "vertical",
    scrollY: undefined,
  },
);
</script>

<template>
  <ScrollAreaRoot
    :type="type"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      class="h-full w-full rounded-[inherit]"
      @scroll="scrollY"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
