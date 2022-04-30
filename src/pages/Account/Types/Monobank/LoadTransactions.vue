<template>
  <div class="load-transactions">
    <DateField
      v-model="form.period"
      :disable-after="new Date()"
      mode="range"
    />
    <Button @click="loadTransactionsForPeriod">
      Load transactions
    </Button>
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
      period: null,
    });

    const account = computed(
      () => getAccountById.value(route.query.id as string),
    );

    const loadTransactionsForPeriod = async () => {
      if (form.period) {
        const dates = form.period.split(' to ');
        const from = new Date(dates[0]).getTime();
        const to = new Date(dates[1]).getTime();
        await monobankStore.loadTransactionsForPeriod({
          accountId: account.value.accountId,
          from,
          to,
        });
        addNotification({
          text: 'Loaded successfully',
          type: NotificationType.success,
        });
        form.period = null;
      }
    };

    return {
      form,
      loadTransactionsForPeriod,
    };
  },
});
</script>

<style lang="scss" scoped>
.load-transactions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
