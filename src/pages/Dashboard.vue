<template>
  <section class="dashboard">
    <AccountsList class="dashboard__accounts" />
    <div class="dashboard__info">
      <div class="dashboard__charts">
        Charts
      </div>
      <div class="dashboard__records">
        <TransactionsList />
        <router-link
          class="dashboard__show-all"
          :to="{ name: 'records' }"
        >
          Show all records
        </router-link>
      </div>
    </div>
    <!-- <div class="dashboard__header">
      <Button @click="updateWebhookHandler">
        Update monobank webhook
      </Button>
    </div> -->
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { storeToRefs } from 'pinia';
import {
  indexVuexTypes,
  userVuexTypes,
  categoriesVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';
import { useRootStore } from '@/newStore';
import { TooManyRequestsError } from '@/js/errors';
import { ErrorHandler } from '@/js/utils';
import TransactionsList from '@/components/page-sections/dashboard/TransactionsList.vue';
import AccountsList from '@/components/page-sections/dashboard/AccountsList/AccountsList.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    TransactionsList,
    AccountsList,
  },
  setup() {
    const rootStore = useRootStore();

    const { isAppInitialized: isNewAppInitialized } = storeToRefs(rootStore);

    onMounted(async () => {
      rootStore.fetchInitialData();
    });

    return {
      isNewAppInitialized,
    };
  },
  computed: {
    ...mapGetters({
      isAppInitialized: indexVuexTypes.GET_APP_INIT_STATUS,
    }),
    ...mapGetters('user', {
      user: userVuexTypes.GET_USER,
    }),
    ...mapGetters('categories', {
      categories: categoriesVuexTypes.GET_CATEGORIES,
    }),
    ...mapGetters('bankMonobank', {
      monoUser: bankMonobankVuexTypes.GET_USER,
      accounts: bankMonobankVuexTypes.GET_ACCOUNTS,
    }),
  },
  async mounted() {
    if (!this.isAppInitialized) {
      await this.fetchInitialData();
    }
    this.fetchAccounts();
  },
  methods: {
    ...mapActions({
      fetchInitialData: indexVuexTypes.FETCH_INITIAL_DATA,
    }),
    ...mapActions('bankMonobank', {
      updateWebhook: bankMonobankVuexTypes.UPDATE_WEBHOOK,
      fetchAccounts: bankMonobankVuexTypes.FETCH_ACCOUNTS,
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
});
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
  background-color: var(--app-surface-color);
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
.dashboard__charts {
  color: var(--app-on-surface-color);
}
.dashboard__show-all {
  display: block;
  color: var(--primary-500);
  text-align: center;
}
</style>
