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
      <p>Description: {{ transaction.description }}</p>
    </div>
    <div class="monobank-tx-form__row">
      <CategorySelectField
        v-model="form.category"
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

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {
  indexVuexTypes,
  accountsVuexTypes,
  categoriesVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';
import { MONOTransactionRecord } from '@/js/records';
import CategorySelectField from '@/components/fields/CategorySelectField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import Button from '@/components/common/Button.vue';

const EVENTS = {
  closeModal: 'close-modal',
};

export default defineComponent({
  name: 'MonobankTxForm',
  components: {
    CategorySelectField,
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
      category: null,
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
      rawCategories: categoriesVuexTypes.GET_RAW_CATEGORIES,
    }),
  },
  created() {
    this.form.note = this.transaction.note;
    this.form.category = this.rawCategories
      .find(item => item.id === this.transaction.categoryId);
  },
  methods: {
    ...mapActions('bankMonobank', {
      editTransaction: bankMonobankVuexTypes.UPDATE_TRANSACTION_BY_ID,
    }),
    async submit() {
      this.isLoading = true;
      const { note, category } = this.form;

      const params = {
        note,
        categoryId: category.id,
      };

      await this.editTransaction({
        id: this.transaction.id,
        ...params,
      });
      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.monobank-tx-form {
  background-color: #fff;
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
