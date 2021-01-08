<template>
  <div class="accounts-list">
    <template
      v-for="account in accounts"
      :key="account.id"
    >
      <div>
        {{ account.balance }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  indexVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';

export default {
  computed: {
    ...mapGetters({
      isAppInitialized: indexVuexTypes.GET_APP_INIT_STATUS,
    }),
    ...mapGetters('bankMonobank', {
      accounts: bankMonobankVuexTypes.GET_ACCOUNTS,
    }),
  },
  watch: {
    isAppInitialized: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchAccounts();
        }
      },
    },
  },
  methods: {
    ...mapActions('bankMonobank', {
      fetchAccounts: bankMonobankVuexTypes.FETCH_ACCOUNTS,
    }),
  },
};
</script>
