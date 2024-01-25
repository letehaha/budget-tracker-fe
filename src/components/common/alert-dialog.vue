<script lang="ts" setup>
import * as AlertDialog from "@/components/lib/ui/alert-dialog";

defineEmits(["accept", "cancel"]);
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    cancelLabel?: string;
    acceptLabel?: string;
  }>(),
  {
    description: undefined,
    cancelLabel: "Cancel",
    acceptLabel: "Accept",
  },
);
</script>

<template>
  <AlertDialog.AlertDialog>
    <AlertDialog.AlertDialogTrigger as-child>
      <slot name="trigger"></slot>
    </AlertDialog.AlertDialogTrigger>
    <AlertDialog.AlertDialogContent>
      <slot>
        <AlertDialog.AlertDialogHeader>
          <AlertDialog.AlertDialogTitle v-if="title">
            {{ title }}
          </AlertDialog.AlertDialogTitle>

          <AlertDialog.AlertDialogDescription v-if="description">
            {{ description }}
          </AlertDialog.AlertDialogDescription>

          <slot name="content" />
        </AlertDialog.AlertDialogHeader>
        <AlertDialog.AlertDialogFooter>
          <AlertDialog.AlertDialogCancel @click="$emit('cancel')">
            {{ cancelLabel }}
          </AlertDialog.AlertDialogCancel>
          <AlertDialog.AlertDialogAction @click="$emit('accept')">
            {{ acceptLabel }}
          </AlertDialog.AlertDialogAction>
        </AlertDialog.AlertDialogFooter>
      </slot>
    </AlertDialog.AlertDialogContent>
  </AlertDialog.AlertDialog>
</template>
