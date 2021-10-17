<template>
  <div class="api-keys-form">
    <h3>Please define your API keys</h3>
    <InputField
      v-model="form.public"
      label="Public Key"
    />
    <InputField
      v-model="form.secret"
      label="Secret Key"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import InputField from '@/components/fields/InputField.vue';

export default defineComponent({
  components: { InputField },
  setup() {
    const form = ref({
      public: '',
      secret: '',
    });

    return {
      form,
    };
  },
});
</script>
