<template>
  <p v-if="errorMessage" class="absolute mt-1 ml-2 text-xs text-error-message">
    {{ errorMessage }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    errorMessage: { type: String, default: undefined },
  },
});
</script>
