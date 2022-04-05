<template>
  <div class="system-tx-form">
    <div>
      <button @click="$emit(EVENTS.closeModal)">
        Close
      </button>
    </div>
    <div class="system-tx-form__row">
      <InputField
        v-model="form.amount"
        type="number"
        placeholder="Amount"
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.account"
        label="Account"
        :values="accounts"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.category"
        label="Category"
        :values="categories"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.type"
        label="Transaction Type"
        :values="transactionTypes"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <DateField
        v-model="form.time"
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.paymentType"
        label="Payment Type"
        :values="paymentTypes"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <TextareaField
        v-model="form.note"
        placeholder="Note"
        label="Note (optional)"
      />
    </div>
    <div class="system-tx-form__actions">
      <Button
        v-if="transaction"
        class="system-tx-form__action"
        @click="deleteTransactionHandler"
      >
        Delete
      </Button>
      <Button
        class="
          system-tx-form__action
          system-tx-form__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        {{ transaction ? 'Edit' : 'Submit' }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { storeToRefs } from 'pinia';
import {
  usePaymentTypesStore,
  useTransactionTypesStore,
  useAccountsStore,
} from '@/newStore';
import {
  categoriesVuexTypes,
  transactionsVuexTypes,
} from '@/store';
import { TransactionRecord } from '@/js/records';
import InputField from '@/components/fields/InputField.vue';
import SelectField from '@/components/fields/SelectField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import DateField from '@/components/fields/DateField.vue';
import Button from '@/components/common/Button.vue';

const EVENTS = {
  closeModal: 'close-modal',
};

export default defineComponent({
  components: {
    DateField,
    InputField,
    SelectField,
    TextareaField,
    Button,
  },
  props: {
    transaction: {
      type: TransactionRecord,
      default: undefined,
    },
  },
  setup() {
    const store = usePaymentTypesStore();
    const transactionTypesStore = useTransactionTypesStore();
    const accountsStore = useAccountsStore();

    const { paymentTypes } = storeToRefs(store);
    const { accounts } = storeToRefs(accountsStore);
    const { transactionTypes } = storeToRefs(transactionTypesStore);

    return {
      accounts,
      paymentTypes,
      transactionTypes,
    };
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
    isLoading: false,
  }),
  computed: {
    ...mapGetters('categories', {
      categories: categoriesVuexTypes.GET_CATEGORIES,
    }),
  },
  watch: {
    transaction: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          this.form = {
            amount: value.amount,
            account: this.accounts.find(i => i.id === value.accountId),
            type: this.transactionTypes
              .find(i => i.id === value.transactionTypeId),
            category: this.categories.find(i => i.id === value.categoryId),
            time: value.time,
            paymentType: this.paymentTypes
              .find(i => i.id === value.paymentTypeId),
            note: value.note,
          };
        }
      },
    },
  },
  methods: {
    ...mapActions('transactions', {
      createTransaction: transactionsVuexTypes.CREATE_TRANSACTION,
      editTransaction: transactionsVuexTypes.EDIT_TRANSACTION,
      deleteTransaction: transactionsVuexTypes.DELETE_TRANSACTION,
    }),
    async submit() {
      this.isLoading = true;
      const {
        amount,
        note,
        time,
        type: { id: transactionTypeId },
        paymentType: { id: paymentTypeId },
        account: { id: accountId },
        category: { id: categoryId },
      } = this.form;

      const params = {
        amount,
        note,
        time,
        transactionTypeId,
        paymentTypeId,
        accountId,
        categoryId,
      };

      if (this.transaction) {
        await this.editTransaction({
          txId: this.transaction.id,
          ...params,
        });
      } else {
        await this.createTransaction(params);
      }
      this.isLoading = false;
    },
    async deleteTransactionHandler() {
      this.isLoading = true;

      await this.deleteTransaction({ txId: this.transaction.id });

      this.$emit(EVENTS.closeModal);

      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.system-tx-form {
  background-color: var(--app-bg-color);
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.system-tx-form__row {
  margin-bottom: 20px;
}
.system-tx-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.system-tx-form__action--submit {
  margin-left: auto;
}
</style>
