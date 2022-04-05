import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { PaymentTypeResponse } from 'shared-types';
import { PaymentTypeRecord } from '@/js/records';

export const usePaymentTypesStore = defineStore('payment-types', () => {
  const paymentTypes: Ref<PaymentTypeRecord[]> = ref([]);

  const loadPaymentTypes = async () => {
    const result: PaymentTypeResponse[] = await api.get('/models/payment-types');

    paymentTypes.value = result.map(item => new PaymentTypeRecord(item));
  };

  return {
    paymentTypes,
    loadPaymentTypes,
  };
});
