<template>
  <div class="settings-currencies">
    <add-new-currency />

    <currencies-list />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CurrenciesList from './list.vue';
import AddNewCurrency from './add-new-currency.vue';

export default defineComponent({
  components: {
    AddNewCurrency,
    CurrenciesList,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.settings-currencies {
  @include surface-container();

  padding: 16px 0;
}
</style>
