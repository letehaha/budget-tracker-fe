<template>
  <div class="form-header">
    <div />
    <div class="form-header__title">
      {{ isFormCreation ? "Add Record" : "Edit Record" }}
    </div>
    <button class="form-header__action" type="button" @click="emit('close')">
      Cancel
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close"]);

defineProps<{ isFormCreation: boolean }>();
</script>

<style lang="scss" scoped>
.form-header {
  display: grid;
  align-items: center;
  grid-template-columns: 60px 1fr min-content;
  grid-gap: 8px;
}
.form-header__title {
  font-size: 19px;
  color: #fff;
  text-align: center;
}
.form-header__action {
  @include button-style-reset();

  color: #fff;

  font-size: 16px;

  padding: 4px 8px;
  border-radius: 5px;
  transition: background-color 0.1s ease-out;

  &:hover {
    background-color: rgba(#fff, 0.3);
  }
}
</style>
