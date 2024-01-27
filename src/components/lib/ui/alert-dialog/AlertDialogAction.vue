<script setup lang="ts">
import { AlertDialogAction, type AlertDialogActionProps } from "radix-vue";
import { cn } from "@/lib/utils";
import {
  buttonVariants,
  type ButtonVariantProps,
} from "@/components/lib/ui/button";

const props = defineProps<
  AlertDialogActionProps & { variant: ButtonVariantProps["variant"] }
>();
</script>

<template>
  <AlertDialogAction
    v-bind="props"
    :class="
      cn(buttonVariants({ variant: variant ?? 'default' }), $attrs.class ?? '')
    "
  >
    <slot />
  </AlertDialogAction>
</template>
