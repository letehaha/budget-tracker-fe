<template>
  <div class="load-transactions">
    <div class="load-transactions__title">
      Load transactions for selected period
    </div>
    <div class="load-transactions__wrapper">
      <DateField
        v-model="form.from"
        label="From"
      />
      <DateField
        v-model="form.to"
        label="To"
      />
      <Button
        :disabled="!isPeriodSelected"
        @click="loadTransactionsForPeriod"
      >
        {{ isPeriodSelected ? 'Load transactions' : 'Select period' }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, PropType,
} from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBanksMonobankStore } from '@/stores';
import { MONOAccountRecord } from '@/js/records';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';
import Button from '@/components/common/Button.vue';
import DateField from '@/components/fields/DateField.vue';

export default defineComponent({
  components: {
    DateField,
    Button,
  },
  props: {
    account: {
      type: Object as PropType<MONOAccountRecord>,
      required: true,
    },
  },
  setup() {
    const route = useRoute();
    const { addNotification } = useNotificationCenter();
    const monobankStore = useBanksMonobankStore();

    const { getAccountById } = storeToRefs(monobankStore);

    const form = reactive({
      from: null,
      to: null,
    });

    const isPeriodSelected = computed(() => form.from && form.to);

    const account = computed(
      () => getAccountById.value(route.query.id as string),
    );

    const loadTransactionsForPeriod = async () => {
      if (isPeriodSelected.value) {
        const from = new Date(form.from).getTime();
        const to = new Date(form.to).getTime();
        await monobankStore.loadTransactionsForPeriod({
          accountId: account.value.accountId,
          from,
          to,
        });

        addNotification({
          text: 'Loaded successfully',
          type: NotificationType.success,
        });

        form.from = null;
        form.to = null;
      }
    };

    return {
      form,
      isPeriodSelected,
      loadTransactionsForPeriod,
    };
  },
});
</script>

<style lang="scss" scoped>
.load-transactions__title {
  font-size: 24px;
  color: var(--app-on-surface-color);
  margin-bottom: 16px;
}
.load-transactions__wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
</style>
