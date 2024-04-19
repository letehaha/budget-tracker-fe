<script setup lang="ts">
import { format } from "date-fns";

import { InvestmentTransactionModel } from "shared-types";

defineProps<{
  transaction: InvestmentTransactionModel;
}>();
</script>

<template>
  <div
    class="grid items-center justify-between w-full grid-cols-[50px,minmax(0,1fr),minmax(0,1fr),min-content] px-2 py-1 text-sm rounded-md cursor-pointer"
  >
    <span class="text-left">
      {{ Number(transaction.quantity).toFixed(2) }} {{ transaction.security }}
    </span>
    <span>
      {{ Number(transaction.price).toFixed(2) }}
    </span>
    <span>
      {{
        (Number(transaction.quantity) * Number(transaction.price)).toFixed(2)
      }}
    </span>
    <div class="text-sm">
      {{ format(new Date(transaction.date), "dd/MM/yyyy") }}
    </div>
  </div>
</template>
