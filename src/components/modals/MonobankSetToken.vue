<template>
  <div class="monobank-set-token">
    <div>
      <button @click="$emit(EVENTS.closeModal)">
        Close
      </button>
    </div>
    <p class="monobank-set-token__descr">
      Please visit
      <a href="https://api.monobank.ua/">https://api.monobank.ua/</a>
      and follow all instructions. At the end you will see token that should be
      copied and pasted to the field below.
    </p>
    <div class="monobank-set-token__row">
      <InputField
        v-model="form.token"
        label="Token"
      />
    </div>
    <div class="monobank-set-token__actions">
      <Button
        class="
          monobank-set-token__action
          monobank-set-token__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        <template v-if="isUpdate">
          Update token
        </template>
        <template v-else>
          Pair account
        </template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useBanksMonobankStore } from '@/stores';
import InputField from '@/components/fields/InputField.vue';
import Button from '@/components/common/Button.vue';

const EVENTS = {
  closeModal: 'close-modal',
};

export default defineComponent({
  name: 'MonobankSetToken',
  components: {
    InputField,
    Button,
  },
  props: {
    isUpdate: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const monobankStore = useBanksMonobankStore();

    const isLoading = ref(false);
    const form = reactive({
      token: null,
    });

    const submit = async () => {
      isLoading.value = true;

      if (props.isUpdate) {
        await monobankStore.updateUser({ token: form.token });
      } else {
        await monobankStore.pairAccount({ token: form.token });
      }

      isLoading.value = false;
      emit(EVENTS.closeModal);
    };

    return {
      EVENTS,
      form,
      isLoading,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.monobank-set-token {
  background-color: var(--app-bg-color);
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.monobank-set-token__row {
  margin-bottom: 20px;
}
.monobank-set-token__actions {
  display: flex;
  justify-content: center;
}
.monobank-set-token__descr {
  margin: 20px 0;
}
</style>
