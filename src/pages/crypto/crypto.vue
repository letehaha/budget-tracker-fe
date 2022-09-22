<template>
  <div class="crypto">
    <h1 class="crypto__title">
      Crypto
    </h1>

    <template v-if="isDataLoading">
      LOADING...
    </template>

    <template v-else>
      <template v-if="isAPIKeysDefined">
        <GeneralList />
      </template>

      <template v-else>
        <APIKeysForm />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { ERROR_CODES } from 'shared-types';
import {
  defineComponent,
  ref,
  onBeforeMount,
} from 'vue';
import { formatFiat } from '@/js/helpers';
import { ApiErrorResponseError } from '@/js/errors';
import { useCryptoBinanceStore } from '@/stores';
import GeneralList from './components/general-list.vue';
import APIKeysForm from './components/api-keys-form.vue';

export default defineComponent({
  components: {
    GeneralList,
    APIKeysForm,
  },
  setup() {
    const binanceStore = useCryptoBinanceStore();

    const isAPIKeysDefined = ref(false);
    const isDataLoading = ref(false);

    onBeforeMount(async () => {
      isDataLoading.value = true;

      try {
        await binanceStore.loadAccountData();

        isAPIKeysDefined.value = true;
      } catch (e) {
        if (e instanceof ApiErrorResponseError) {
          if (
            [
              ERROR_CODES.cryptoBinanceBothAPIKeysDoesNotexist,
              ERROR_CODES.cryptoBinancePublicAPIKeyNotDefined,
              ERROR_CODES.cryptoBinanceSecretAPIKeyNotDefined,
            ].includes(e.data.code as number)
          ) {
            isAPIKeysDefined.value = false;
          }
        }
      } finally {
        isDataLoading.value = false;
      }
    });

    return {
      formatFiat,
      isAPIKeysDefined,
      isDataLoading,
    };
  },
});
</script>

<style lang="scss">
.crypto {
  padding: 24px;
  color: var(--app-on-bg-color);
}
.crypto__balance {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
</style>
