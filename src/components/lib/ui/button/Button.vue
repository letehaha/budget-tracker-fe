<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantProps } from ".";

interface Props extends PrimitiveProps {
  variant?: ButtonVariantProps["variant"];
  size?: ButtonVariantProps["size"];
  as?: string;
}

withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "default",
  as: "button",
});
</script>

<template>
  <Primitive
    :as="as"
    :type="as === 'button' ? $attrs.type || 'type' : undefined"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </Primitive>
</template>
