import { ref, Ref } from 'vue';

export enum MODAL_TYPES {
  systemTxForm = 'systemTxForm',
  monobankTxForm = 'monobankTxForm',
  monobankSetToken = 'monobankSetToken',
}

export interface ModalDataProp {
  id?: number | string;
  data?: Record<string, unknown>;
  type: MODAL_TYPES;
  hideOnWidth?: number;
}

let idCounter = 0;
const activeModals = ref<ModalDataProp[]>([]);

export const useModalCenter = (): {
  activeModals: Ref<ModalDataProp[]>;
  addModal: (modal: ModalDataProp) => void;
  removeModal: (modal: ModalDataProp) => void;
} => {
  const addModal = (modal: ModalDataProp) => {
    const id = modal.id ?? idCounter++;

    activeModals.value.push({
      id,
      ...modal,
    });
  };

  const removeModal = (modal: ModalDataProp) => {
    const index = activeModals.value.findIndex(
      item => item.id === modal.id,
    );

    activeModals.value.splice(index, 1);
  };

  return {
    activeModals,
    addModal,
    removeModal,
  };
};
