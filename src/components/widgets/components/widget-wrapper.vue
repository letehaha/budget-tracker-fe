<template>
  <Card
    class="max-h-[350px]"
    :class="{
      'max-h-[724px]': higher,
    }"
  >
    <CardHeader>
      <slot name="header">
        <div
          class="grid grid-cols-[minmax(0,1fr),max-content,20px] gap-1 items-center justify-between"
        >
          <h3>
            {{ title }}
          </h3>

          <div>
            <slot name="action" />
          </div>

          <template v-if="isFetching">
            <Loader2Icon class="text-white opacity-50 size-5 animate-spin" />
          </template>
        </div>
      </slot>
    </CardHeader>

    <CardContent class="widget-wrapper__content">
      <slot />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Loader2Icon } from "lucide-vue-next";
import { Card, CardContent, CardHeader } from "@/components/lib/ui/card";

withDefaults(
  defineProps<{
    title?: string;
    higher?: boolean;
    isFetching?: boolean;
  }>(),
  {
    title: undefined,
    isFetching: false,
  },
);
</script>
