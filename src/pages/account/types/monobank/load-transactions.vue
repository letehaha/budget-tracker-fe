<template>
  <div class="load-transactions">
    <div class="load-transactions__title">
      Load transactions for selected period
    </div>
    <div class="load-transactions__wrapper">
      <date-field
        v-model="form.from"
        label="From"
      />
      <date-field
        v-model="form.to"
        label="To"
      />
      <ui-button
        :disabled="!isPeriodSelected"
        @click="loadTransactionsForPeriod"
      >
        {{ isPeriodSelected ? 'Load transactions' : 'Select period' }}
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, PropType,
} from 'vue';
import { AccountModel } from 'shared-types';
import { useBanksMonobankStore } from '@/stores';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';
import UiButton from '@/components/common/ui-button.vue';
import DateField from '@/components/fields/date-field.vue';

export default defineComponent({
  components: {
    DateField,
    UiButton,
  },
  props: {
    account: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  },
  setup(props) {
    const { addNotification } = useNotificationCenter();
    const monobankStore = useBanksMonobankStore();

    const form = reactive({
      from: null,
      to: null,
    });

    const isPeriodSelected = computed(() => form.from && form.to);

    const loadTransactionsForPeriod = async () => {
      try {
        if (isPeriodSelected.value) {
          const from = new Date(form.from).getTime();
          const to = new Date(form.to).getTime();

          await monobankStore.loadTransactionsForPeriod({
            accountId: props.account.id,
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
      } catch (err) {
        addNotification({
          text: 'Unexpected error',
          type: NotificationType.error,
        });
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
