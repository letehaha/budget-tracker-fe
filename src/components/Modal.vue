<template>
  <div
    class="modal"
    :class="{ 'modal--active': isActive }"
    @click.self="$emit(EVENTS.close)"
  >
    <component
      :is="data.type"
      v-bind="data.data"
      class="modal__component"
      @close-modal="$emit(EVENTS.close)"
    />
  </div>
</template>

<script lang="ts">
import {
  defineAsyncComponent, PropType, AsyncComponentLoader, defineComponent,
} from 'vue';

export const MODAL_TYPES = Object.freeze({
  systemTxForm: defineAsyncComponent(() => import('@/components/modals/SystemTxForm.vue')),
  monobankTxForm: defineAsyncComponent(() => import('@/components/modals/MonobankTxForm.vue')),
  monobankSetToken: defineAsyncComponent(() => import('@/components/modals/MonobankSetToken.vue')),
});

const EVENTS = {
  close: 'close',
};

type ModalDataProp = {
  data: unknown;
  type: AsyncComponentLoader;
  hideOnWidth: number;
}

export default defineComponent({
  props: {
    isActive: { type: Boolean, default: false },
    /**
     * @param data - modal object
     * @param data.data - passed data
     * @param data.type - modal type
     * @param data.hideOnWidth - hide modal on window width
     */
    data: {
      type: Object as PropType<ModalDataProp>,
      required: true,
      validator(value: ModalDataProp) {
        if (Object.keys(value).length) {
          // TODO: add check for a right value
          if (!value.type) {
            // eslint-disable-next-line no-console
            console.error('Modal component. Data prop should contain required "type" key.');
            return false;
          }
        }
        return true;
      },
    },
  },
  data: () => ({
    EVENTS,
  }),
  created() {
    window.addEventListener('resize', this.windowResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.windowResize);
  },
  methods: {
    windowResize() {
      if (this.data.hideOnWidth && this.isActive) {
        const width = window.innerWidth;
        if (width < this.data.hideOnWidth) {
          this.$emit(EVENTS.close);
        }
      }
    },
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
  background-color: rgba(#1b1f26, 0.9);
  opacity: 0;
  visibility: hidden;
  transition: .3s ease-out;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 24px 24px;
  cursor: pointer;

  z-index: var(--z-modal);

  &.modal--active {
    opacity: 1;
    visibility: visible;
  }
}
.modal__component {
  cursor: initial;
}
</style>
