<template>
  <div class="p-6">
    <div class="flex gap-6">
      <div class="flex flex-col gap-6">
        <Card.Card class="max-w-[600px] w-full">
          <AccountHeader :account="account" />
        </Card.Card>

        <Card.Card class="max-w-[600px] w-full">
          <Card.CardHeader>
            <div class="flex items-center justify-between">
              <span> Holdings </span>
              <AddHolding :account="account" />
            </div>
          </Card.CardHeader>
          <Card.CardContent class="grid gap-1">
            <template v-for="holding in holdings" :key="holding.id">
              <template v-if="securitiesRecord[holding.securityId]">
                <Button
                  variant="ghost"
                  class="flex items-center justify-between"
                  @click="() => (activeHolding = holding)"
                >
                  <span>
                    {{ securitiesRecord[holding.securityId].name }}
                  </span>
                  <span>
                    {{ securitiesRecord[holding.securityId].symbol }} |
                    {{ securitiesRecord[holding.securityId].currencyCode }}
                  </span>
                  <span>
                    {{ parseFloat(holding.quantity) }}
                  </span>
                  <span>
                    {{ parseFloat(holding.value) }} {{ holding.currencyCode }}
                  </span>
                  <span>
                    {{ parseFloat(holding.costBasis) }}
                    {{ holding.currencyCode }}
                  </span>
                </Button>
              </template>
            </template>
          </Card.CardContent>
        </Card.Card>
      </div>

      <template v-if="activeHolding">
        <HoldingCard :account="account" :holding="activeHolding" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { HoldingModel } from "shared-types";
import { storeToRefs } from "pinia";
import * as Card from "@/components/lib/ui/card";
import AccountHeader from "@/pages/account/components/header.vue";
import { useAccountsStore } from "@/stores";

import { useFetchHoldingsList, useFetchSecuritiesList } from "@/composable";
import Button from "@/components/lib/ui/button/Button.vue";
import AddHolding from "./add-holding.vue";
import HoldingCard from "./holding-card.vue";

const route = useRoute();
const accountsStore = useAccountsStore();
const { accountsRecord } = storeToRefs(accountsStore);
const account = computed(() => accountsRecord.value[+route.params.id]);
const { data: holdings } = useFetchHoldingsList();
const { data: securities } = useFetchSecuritiesList();

const activeHolding = ref<HoldingModel | null>(null);

const securitiesRecord = computed(() =>
  securities.value.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {}),
);
</script>
