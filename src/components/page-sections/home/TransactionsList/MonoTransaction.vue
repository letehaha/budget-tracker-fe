<template>
  <div
    class="transaction"
    :class="`transaction--${tx.transactionTypeId}`"
    @click="editTransaction(tx)"
  >
    <div class="transaction__info">
      <div class="transaction__category">
        {{ category.name }}
      </div>
      <div class="transaction__note">
        {{ tx.description }}
      </div>
    </div>
    <div class="transaction__right">
      <div class="transaction__amount">
        {{ formatAmount(tx.amount) }}
        <!-- {{ tx.account.currency.asset }} -->
      </div>
      <div class="transaction__time">
        {{ formateDate(tx.time) }}
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { TRANSACTIONS_TYPES } from '@/js/const';
import { mapGetters } from 'vuex';
import { categoriesVuexTypes } from '@/store';
import { formatAmount } from '@/js/helpers';
import { MODAL_TYPES } from '@/components/Modal';

export default {
  props: {
    tx: { type: Object, required: true },
  },
  computed: {
    ...mapGetters('categories', {
      categoryById: categoriesVuexTypes.GET_CATEGORY_BY_ID,
    }),
    category() {
      return this.categoryById(this.tx.categoryId);
    },
  },
  methods: {
    formatAmount,
    formateDate(date) {
      return format(new Date(date), 'd MMMM Y');
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
    getCategoryName() {},
  },
};
</script>

<style lang="scss" scoped>
.transaction {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #ffffff;
  cursor: pointer;
}
.transaction--income {
  background-color: #2ecc71;
  box-shadow: 0 0 10px 4px rgba(#2ecc71, .1);
}
.transaction--expense {
  background-color: #e74c3c;
  box-shadow: 0 0 10px 4px rgba(#e74c3c, .1);
}
.transaction--transfer {
  background-color: #34495e;
  box-shadow: 0 0 10px 4px rgba(#34495e, .1);
}
.transaction__note {
  color: #eaeaea;
  font-size: 14px;
}
.transaction__amount {
  text-align: right;
}
</style>
