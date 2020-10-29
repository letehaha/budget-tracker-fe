<template>
  <div class="transaction-form-modal">
    <div>
      <button
        @click="$emit(EVENTS.closeModal)"
      >
        Close
      </button>
    </div>
    <div class="transaction-form-modal__row">
      <InputField
        v-model="form.amount"
        type="number"
        placeholder="Amount"
      />
    </div>
    <div class="transaction-form-modal__row">
      <SelectField
        v-model="form.account"
        label="Account"
        :values="accounts"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="transaction-form-modal__row">
      <SelectField
        v-model="form.category"
        label="Category"
        :values="categories"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="transaction-form-modal__row">
      <SelectField
        v-model="form.type"
        label="Transaction Type"
        :values="transactionTypes"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="transaction-form-modal__row">
      <DateField
        v-model="form.time"
      />
    </div>
    <div class="transaction-form-modal__row">
      <SelectField
        v-model="form.paymentType"
        label="Payment Type"
        :values="paymentTypes"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="transaction-form-modal__row">
      <TextareaField
        v-model="form.note"
        placeholder="Note"
        label="Note (optional)"
      />
    </div>
    <div class="transaction-form-modal__actions">
      <Button
        v-if="transaction"
        class="transaction-form-modal__action"
        @click="deleteTransaction"
      >
        Delete
      </Button>
      <Button
        class="
          transaction-form-modal__action
          transaction-form-modal__action--submit
        "
        @click="submit"
      >
        {{ transaction ? 'Edit' : 'Submit' }}
      </Button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { indexVuexTypes, transactionsVuexTypes } from '@/store';
import { COLLECTIONS_NAMES } from '@/js/const';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import TextareaField from '@/components/fields/TextareaField';
import DateField from '@/components/fields/DateField';
import Button from '@/components/common/Button';

const EVENTS = {
  closeModal: 'close-modal',
};

export default {
  components: {
    DateField,
    InputField,
    SelectField,
    TextareaField,
    Button,
  },
  props: {
    transactionId: { type: String, default: undefined },
  },
  data: () => ({
    EVENTS,
    form: {
      amount: null,
      account: null,
      category: null,
      time: null,
      paymentType: null,
      note: null,
      type: null,
    },
  }),
  computed: {
    ...mapGetters({
      accounts: indexVuexTypes.GET_ACCOUNTS,
      currencies: indexVuexTypes.GET_CURRENCIES,
      categories: indexVuexTypes.GET_CATEGORIES,
      paymentTypes: indexVuexTypes.GET_PAYMENT_TYPES,
      transactionTypes: indexVuexTypes.GET_TRANSACTION_TYPES,
    }),
    ...mapGetters('transactions', {
      transactionById: transactionsVuexTypes.GET_TRANSACTION_BY_ID,
    }),
    transaction() {
      return this.transactionById(this.transactionId);
    },
  },
  watch: {
    transaction: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          this.form = {
            amount: value.amount,
            account: value.account,
            type: value.type,
            category: value.category,
            time: value.time,
            paymentType: value.paymentType,
            note: value.note,
          };
        }
      },
    },
  },
  methods: {
    async submit() {
      if (this.transaction) {
        await this.editTransaction();
      } else {
        await this.saveTrasnaction();
      }
      this.$emit(EVENTS.closeModal);
    },
    async saveTrasnaction() {
      await this.$fireStore
        .collection(COLLECTIONS_NAMES.transactions)
        .doc()
        .set(this.prepareTransactionData());
    },
    async editTransaction() {
      await this.$fireStore
        .collection(COLLECTIONS_NAMES.transactions)
        .doc(this.transaction.id)
        .update(this.prepareTransactionData());
    },
    async deleteTransaction() {
      await this.$fireStore
        .collection(COLLECTIONS_NAMES.transactions)
        .doc(this.transaction.id)
        .delete();

      this.$emit(EVENTS.closeModal);
    },
    prepareTransactionData() {
      return {
        amount: this.form.amount,
        time: new Date(this.form.time),
        note: this.form.note,
        account: this.$fireStore
          .collection(COLLECTIONS_NAMES.accounts)
          .doc(this.form.account.id),
        category: this.$fireStore
          .collection(COLLECTIONS_NAMES.categories)
          .doc(this.form.category.id),
        paymentType: this.$fireStore
          .collection(COLLECTIONS_NAMES.paymentTypes)
          .doc(this.form.paymentType.id),
        type: this.$fireStore
          .collection(COLLECTIONS_NAMES.transactionTypes)
          .doc(this.form.type.id),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.transaction-form-modal {
  background-color: #ffffff;
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.transaction-form-modal__row {
  margin-bottom: 20px;
}
.transaction-form-modal__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.transaction-form-modal__action--submit {
  margin-left: auto;
}
</style>
