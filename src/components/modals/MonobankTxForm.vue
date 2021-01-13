<template>
  <div class="monobank-tx-form">
    <div>
      <button @click="$emit(EVENTS.closeModal)">
        Close
      </button>
    </div>
    <div class="monobank-tx-form__row">
      <p>Amount: {{ transaction.formattedAmount }}</p>
      <p>Type: {{ transaction.transactionTypeId }}</p>
      <p>Time: {{ transaction.time }}</p>
      <p>Payment Type: {{ transaction.paymentTypeId }}</p>
      <p>Cashback: {{ +transaction.formattedCashback ? transaction.formattedCashback : '-' }}</p>
    </div>
    <div class="monobank-tx-form__row">
      <SelectField
        v-model="form.categoryId"
        label="Category"
        :values="categories"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="monobank-tx-form__row">
      <TextareaField
        v-model="form.note"
        label="Note"
      />
    </div>
    <div class="monobank-tx-form__actions">
      <Button
        class="
          monobank-tx-form__action
          monobank-tx-form__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        Edit
      </Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  indexVuexTypes,
  accountsVuexTypes,
  categoriesVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';
import { MONOTransactionRecord } from '@/js/records';
import SelectField from '@/components/fields/SelectField';
import TextareaField from '@/components/fields/TextareaField';
import Button from '@/components/common/Button';

const EVENTS = {
  closeModal: 'close-modal',
};

export default {
  name: 'MonobankTxForm',
  components: {
    SelectField,
    TextareaField,
    Button,
  },
  props: {
    transaction: {
      type: MONOTransactionRecord,
      default: undefined,
    },
  },
  data: () => ({
    EVENTS,
    form: {
      categoryId: null,
      note: null,
    },
    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      paymentTypes: indexVuexTypes.GET_PAYMENT_TYPES,
      transactionTypes: indexVuexTypes.GET_TRANSACTION_TYPES,
    }),
    ...mapGetters('accounts', {
      accounts: accountsVuexTypes.GET_ACCOUNTS,
    }),
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
            categoryId: value.categoryId,
            note: value.note,
          };
        }
      },
    },
  },
  methods: {
    ...mapActions('bankMonobank', {
      editTransaction: bankMonobankVuexTypes.UPDATE_TRANSACTION_BY_ID,
    }),
    async submit() {
      this.isLoading = true;
      const { note, categoryId } = this.form;

      const params = {
        note,
        categoryId,
      };

      await this.editTransaction({
        id: this.transaction.id,
        ...params,
      });
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.monobank-tx-form {
  background-color: #ffffff;
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.monobank-tx-form__row {
  margin-bottom: 20px;
}
.monobank-tx-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.monobank-tx-form__action--submit {
  margin-left: auto;
}
</style>
