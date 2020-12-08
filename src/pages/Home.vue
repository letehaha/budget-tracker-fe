<template>
  <section>
    <div class="dashboard__header">
      <Button
        @click="openFormModal"
      >
        Add +
      </Button>
      <Button @click="() => logOut({ router: $router })">
        Log Out
      </Button>
    </div>
    <div class="dashboard__list">
      <template
        v-for="item in transactions"
        :key="item.id"
      >
        <div
          class="dashboard__list-item"
          :class="`dashboard__list-item--${item.transactionTypeId}`"
          @click="editTransaction(item)"
        >
          <div class="dashboard__list-item-info">
            <div class="dashboard__list-item-category">
              {{ item.category?.name }}
            </div>
            <div class="dashboard__list-item-note">
              {{ item.note }}
            </div>
          </div>
          <div class="dashboard__list-item-right">
            <div class="dashboard__list-item-amount">
              {{ item.amount }}
              <!-- {{ item.account.currency.asset }} -->
            </div>
            <div class="dashboard__list-item-time">
              {{ item.time.toLocaleString() }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  authVuexTypes,
  indexVuexTypes,
  transactionsVuexTypes,
  userVuexTypes,
  categoriesVuexTypes,
} from '@/store';
import { TRANSACTIONS_TYPES } from '@/js/const';
import { MODAL_TYPES } from '@/components/Modal';
import Button from '@/components/common/Button';

export default {
  name: 'Dashboard',
  components: {
    Button,
  },
  computed: {
    ...mapGetters({
      accountTypes: indexVuexTypes.GET_ACCOUNT_TYPES,
      paymentTypes: indexVuexTypes.GET_PAYMENT_TYPES,
      txTypes: indexVuexTypes.GET_TRANSACTION_TYPES,
    }),
    ...mapGetters('transactions', {
      transactions: transactionsVuexTypes.GET_TRANSACTIONS,
    }),
    ...mapGetters('user', {
      user: userVuexTypes.GET_USER,
    }),
    ...mapGetters('categories', {
      categories: categoriesVuexTypes.GET_CATEGORIES,
    }),
  },
  async mounted() {
    await this.fetchInitialData();
    this.fetchTransactions();
  },
  methods: {
    ...mapActions({
      fetchInitialData: indexVuexTypes.FETCH_INITIAL_DATA,
    }),
    ...mapActions('transactions', {
      fetchTransactions: transactionsVuexTypes.FETCH_TRANSACTIONS,
    }),
    ...mapActions('auth', {
      logOut: authVuexTypes.LOG_OUT,
    }),
    openFormModal() {
      this.$bus.emit(this.$bus.eventsList.modalOpen, {
        type: MODAL_TYPES.transactionForm,
      });
    },
    editTransaction(transaction) {
      this.$bus.emit(this.$bus.eventsList.modalOpen, {
        type: MODAL_TYPES.transactionForm,
        data: { transaction },
      });
    },
    amountFormatter(amount, type) {
      switch (type) {
        case (TRANSACTIONS_TYPES.expense):
          return `-${amount}`;
        case (TRANSACTIONS_TYPES.income):
          return `+${amount}`;
        case (TRANSACTIONS_TYPES.transfer):
          return amount;
        default:
          return amount;
      }
    },
    getCategoryName() {

    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard__list {
  max-width: 560px;
  margin: 60px auto 0;
}
.dashboard__list-item {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #ffffff;
  cursor: pointer;
}
.dashboard__list-item--income {
  background-color: #2ecc71;
  box-shadow: 0 0 10px 4px rgba(#2ecc71, .1);
}
.dashboard__list-item--expense {
  background-color: #e74c3c;
  box-shadow: 0 0 10px 4px rgba(#e74c3c, .1);
}
.dashboard__list-item--transfer {
  background-color: #34495e;
  box-shadow: 0 0 10px 4px rgba(#34495e, .1);
}
.dashboard__list-item-note {
  color: #eaeaea;
  font-size: 14px;
}
.dashboard__list-item-amount {
  text-align: right;
}
</style>
