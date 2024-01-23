<template>
  <Card
    class="max-h-[350px]"
    :class="{
      'max-h-[724px]': higher,
    }"
  >
    <CardHeader>
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3>
            {{ title }}
          </h3>
          <slot name="action" />
        </div>
      </slot>
    </CardHeader>

    <CardContent class="widget-wrapper__content">
      <slot />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader } from "@/components/lib/ui/card";

withDefaults(
  defineProps<{
    title?: string;
    higher?: boolean;
  }>(),
  {
    title: undefined,
  },
);
</script>
