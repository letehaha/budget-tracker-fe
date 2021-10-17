<template>
  <div class="crypto">
    <h1>Crypto</h1>

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
import { useCryptoBinanceInfo } from '@/composable';
import GeneralList from '@/components/page-sections/crypto/GeneralList.vue';
import APIKeysForm from '@/components/page-sections/crypto/APIKeysForm.vue';

export default defineComponent({
  components: {
    GeneralList,
    APIKeysForm,
  },
  setup() {
    const { fetchAccountData } = useCryptoBinanceInfo();

    const isAPIKeysDefined = ref(false);
    const isDataLoading = ref(false);

    onBeforeMount(async () => {
      isDataLoading.value = true;

      try {
        await fetchAccountData();

        isAPIKeysDefined.value = true;
      } catch (e) {
        if (e instanceof ApiErrorResponseError) {
          if (
            [
              ERROR_CODES.cryptoBinanceBothAPIKeysDoesNotexist,
              ERROR_CODES.cryptoBinancePublicAPIKeyNotDefined,
              ERROR_CODES.cryptoBinanceSecretAPIKeyNotDefined,
            ].includes(e.data.code)
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
}
.crypto__balance {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
</style>
