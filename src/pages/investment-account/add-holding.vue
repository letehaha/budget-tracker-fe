<script setup lang="ts">
import { AccountModel } from "shared-types";
import { computed, ref, watch } from "vue";
import { debounce } from "lodash-es";
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { PlusCircleIcon } from "lucide-vue-next";
import Button from "@/components/lib/ui/button/Button.vue";
import Dropdown from "@/components/common/dropdown.vue";
import { InputField } from "@/components/fields";
import * as Popover from "@/components/lib/ui/popover";
import { loadSecuritiesList, createHolding } from "@/api";
import { useNotificationCenter } from "@/components/notification-center";

const props = defineProps<{
  account: AccountModel;
}>();
const queryClient = useQueryClient();
const { addErrorNotification } = useNotificationCenter();

const popoverOpened = ref(false);

const query = ref("");
const debouncedQuery = ref(query.value);
const debouncer = debounce((newQuery) => {
  debouncedQuery.value = newQuery;
}, 1000);
watch(query, (q) => debouncer(q));

const { data: suggestions, isFetching: isSecuritiesLoading } = useQuery({
  queryKey: ["securities-suggestions", debouncedQuery],
  queryFn: async () => {
    if (!debouncedQuery.value) return [];
    const data = await loadSecuritiesList({ query: debouncedQuery.value });
    return data;
  },
  placeholderData: [],
  staleTime: Infinity,
});

const securitiesDropdownVisible = computed(
  () => popoverOpened.value && !!suggestions.value.length,
);

const createHoldingHandler = async (security) => {
  try {
    await createHolding({
      accountId: props.account.id,
      securityId: security.id,
    });
    query.value = "";
    popoverOpened.value = false;

    queryClient.invalidateQueries({ queryKey: ["useFetchHoldingsList"] });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    addErrorNotification("Cannot add holding!");
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <Popover.Popover
      :open="popoverOpened"
      @update:open="popoverOpened = $event"
    >
      <Popover.PopoverTrigger>
        <Button> + Add holding </Button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent>
        <div class="grid gap-3">
          <InputField v-model="query" placeholder="AAPL">
            <template #label>
              <div class="mb-2 text-sm">Enter symbol or company name</div>
            </template>
          </InputField>

          <div class="text-sm empty:hidden">
            <template v-if="isSecuritiesLoading || query !== debouncedQuery">
              Loading...
            </template>
            <template v-else-if="!isSecuritiesLoading && !suggestions.length">
              No results
            </template>
          </div>

          <Dropdown
            :is-visible="securitiesDropdownVisible"
            :values="suggestions"
            virtual-scroll
            :item-size="48"
            :max-height="210"
            :label-key="(val) => `${val.symbol} – ${val.name}`"
          >
            <template #item="{ item }">
              <div class="py-1">
                <Button
                  variant="ghost"
                  class="flex justify-between w-full gap-1 overflow-hidden whitespace-break-spaces"
                  @click="() => createHoldingHandler(item)"
                >
                  <div class="text-sm text-left line-clamp-2">
                    {{ item.symbol }} - {{ item.name }}
                  </div>
                  <PlusCircleIcon class="flex-shrink-0 size-4" />
                </Button>
              </div>
            </template>
          </Dropdown>
        </div>
      </Popover.PopoverContent>
    </Popover.Popover>
  </div>
</template>
