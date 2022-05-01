<template>
  <div
    v-if="activeModals.length"
    class="modal"
  >
    <transition-group name="fade">
      <template
        v-for="modal in activeModals"
        :key="modal.id"
      >
        <div
          class="modal__overlay"
          @click.self="removeModal(modal)"
        >
          <component
            :is="MODAL_COMPONENTS[modal.type]"
            v-bind="modal.data"
            class="modal__component"
            @close-modal="removeModal(modal)"
          />
        </div>
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import _debounce from 'lodash/debounce';

import {
  defineAsyncComponent,
  defineComponent,
  onBeforeUnmount,
} from 'vue';

import { MODAL_TYPES, useModalCenter } from './index';

const MODAL_COMPONENTS = Object.freeze({
  [MODAL_TYPES.systemTxForm]: defineAsyncComponent(() => import('@/components/modals/SystemTxForm.vue')),
  [MODAL_TYPES.monobankTxForm]: defineAsyncComponent(() => import('@/components/modals/MonobankTxForm.vue')),
  [MODAL_TYPES.monobankSetToken]: defineAsyncComponent(() => import('@/components/modals/MonobankSetToken.vue')),
});

const EVENTS = {
  close: 'close',
};

export default defineComponent({
  setup() {
    const { activeModals, removeModal } = useModalCenter();

    const windowResize = _debounce(() => {
      for (const modal of activeModals.value) {
        if (modal.hideOnWidth < window.innerWidth) {
          removeModal(modal);
        }
      }
    }, 1000);

    window.addEventListener('resize', windowResize);

    onBeforeUnmount(() => {
      windowResize.cancel();
      window.removeEventListener('resize', windowResize);
    });

    return {
      EVENTS,
      MODAL_COMPONENTS,
      activeModals,
      removeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: var(--z-modal);
}
.modal__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(#1b1f26, 0.9);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 24px 24px;
  cursor: pointer;
}
.modal__component {
  cursor: initial;
}
</style>
