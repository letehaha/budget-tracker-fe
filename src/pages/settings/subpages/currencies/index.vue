<template>
  <div class="settings-currencies">
    <add-new-currency />

    <currencies-list />
  </div>
</template>

<script setup lang="ts">
import CurrenciesList from './list.vue';
import AddNewCurrency from './add-new-currency.vue';
</script>
