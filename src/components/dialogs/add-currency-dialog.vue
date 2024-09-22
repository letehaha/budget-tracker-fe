<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useQueryClient } from "@tanstack/vue-query";
import { Button } from "@/components/lib/ui/button";
import * as Select from "@/components/lib/ui/select";
import * as Dialog from "@/components/lib/ui/dialog";
import { useCurrenciesStore } from "@/stores";
import { addUserCurrencies } from "@/api/currencies";
import { useNotificationCenter } from "@/components/notification-center";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";

const emit = defineEmits<{
  added: [value: number];
}>();

const queryClient = useQueryClient();
const currenciesStore = useCurrenciesStore();
const { systemCurrenciesVerbose } = storeToRefs(currenciesStore);
const { addSuccessNotification, addErrorNotification } = useNotificationCenter();
const formStatus = ref<"default" | "loading" | "error">("default");
const isOpen = ref(false);

const form = ref<{
  currencyId: string;
}>({
  currencyId: String(systemCurrenciesVerbose.value.unlinked[0].id),
});

const saveCurrency = async () => {
  try {
    formStatus.value = "loading";

    const currencyId = Number(form.value.currencyId);
    await addUserCurrencies([{ currencyId }]);

    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.exchangeRates });
    await currenciesStore.loadCurrencies();
    addSuccessNotification("Currency successfully added!");
    formStatus.value = "default";
    isOpen.value = false;

    emit("added", currencyId);
  } catch (e) {
    addErrorNotification("Unexpected error. Currency is not added.");
    formStatus.value = "error";
  }
};
</script>

<template>
  <Dialog.Dialog v-model:open="isOpen" @update:open="isOpen = $event">
    <Dialog.DialogTrigger as-child>
      <slot />
    </Dialog.DialogTrigger>
    <Dialog.DialogContent
      class="sm:max-w-md max-h-[90dvh] grid-rows-[auto_auto_minmax(0,1fr)_auto]"
    >
      <Dialog.DialogHeader class="mb-4">
        <Dialog.DialogTitle>Add new currency</Dialog.DialogTitle>
        <Dialog.DialogDescription> Select one currency to add </Dialog.DialogDescription>
      </Dialog.DialogHeader>

      <form class="grid gap-6" @submit.prevent="saveCurrency">
        <Select.Select v-model="form.currencyId" autocomplete="false">
          <Select.SelectTrigger>
            <Select.SelectValue placeholder="Select currency" />
          </Select.SelectTrigger>
          <Select.SelectContent>
            <template v-for="item of systemCurrenciesVerbose.unlinked" :key="item.id">
              <Select.SelectItem :value="String(item.id)">
                {{ item.code }} – {{ item.currency }}
              </Select.SelectItem>
            </template>
          </Select.SelectContent>
        </Select.Select>

        <Button type="submit"> Add </Button>
      </form>
    </Dialog.DialogContent>
  </Dialog.Dialog>
</template>
