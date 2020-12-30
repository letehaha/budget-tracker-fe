<template>
  <section class="dashboard">
    <div class="dashboard__accounts">
      Accounts
    </div>
    <div class="dashboard__info">
      <div class="dashboard__charts">
        Charts
      </div>
      <div class="dashboard__records">
        <TransactionsList />
      </div>
    </div>
    <!-- <div class="dashboard__header">
      <Button @click="updateWebhookHandler">
        Update monobank webhook
      </Button>
    </div> -->
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  indexVuexTypes,
  userVuexTypes,
  categoriesVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';
import { TooManyRequestsError } from '@/js/errors';
import { ErrorHandler } from '@/js/utils';
import TransactionsList from '@/components/page-sections/home/TransactionsList/TransactionsList';

export default {
  name: 'Dashboard',
  components: {
    TransactionsList,
  },
  computed: {
    ...mapGetters({
      accountTypes: indexVuexTypes.GET_ACCOUNT_TYPES,
      paymentTypes: indexVuexTypes.GET_PAYMENT_TYPES,
      txTypes: indexVuexTypes.GET_TRANSACTION_TYPES,
    }),
    ...mapGetters('user', {
      user: userVuexTypes.GET_USER,
    }),
    ...mapGetters('categories', {
      categories: categoriesVuexTypes.GET_CATEGORIES,
    }),
    ...mapGetters('bankMonobank', {
      monoUser: bankMonobankVuexTypes.GET_USER,
    }),
  },
  async mounted() {
    await this.fetchInitialData();
  },
  methods: {
    ...mapActions({
      fetchInitialData: indexVuexTypes.FETCH_INITIAL_DATA,
    }),
    ...mapActions('bankMonobank', {
      updateWebhook: bankMonobankVuexTypes.UPDATE_WEBHOOK,
    }),
    async updateWebhookHandler() {
      try {
        await this.updateWebhook({ clientId: this.monoUser.clientId });
      } catch (e) {
        if (e instanceof TooManyRequestsError) {
          ErrorHandler.process(e, e.data.message);
          return;
        }
        ErrorHandler.processWithoutFeedback(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;
}
.dashboard__info {
  display: grid;
  grid-template-columns: 1fr 420px;
  margin-top: 24px;
  grid-gap: 24px;
}
.dashboard__records {
  padding: 24px;
  background-color: #fff;
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
</style>
