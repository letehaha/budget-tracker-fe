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
            @[EVENTS.closeModal]="removeModal(modal)"
          />
        </div>
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash-es';

import {
  defineAsyncComponent,
  defineComponent,
  onBeforeUnmount,
} from 'vue';

import { MODAL_TYPES, useModalCenter } from './index';

const MODAL_COMPONENTS = Object.freeze({
  [MODAL_TYPES.createRecord]: defineAsyncComponent(() => import('@/components/modals/modify-record/index.vue')),
  [MODAL_TYPES.monobankSetToken]: defineAsyncComponent(() => import('@/components/modals/monobank-set-token.vue')),
});

export enum EVENTS {
  closeModal = 'close'
}

export default defineComponent({
  setup() {
    const { activeModals, removeModal } = useModalCenter();

    const windowResize = debounce(() => {
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
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 24px 24px;
  cursor: pointer;
  overflow: auto;
  background-color: rgba(#1b1f26, 0.4);

  body.dark & {
    background-color: rgba(#1b1f26, 0.9);
  }
}
.modal__component {
  cursor: initial;
}
</style>
