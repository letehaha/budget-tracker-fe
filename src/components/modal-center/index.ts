import { ref, Ref } from "vue";
import { RecordListModalProps } from "@/components/modals/modify-record/record-list.vue";

export enum MODAL_TYPES {
  createRecord = "createRecord",
  recordList = "recordList",
  monobankTxForm = "monobankTxForm",
  monobankSetToken = "monobankSetToken",
}

interface CommonModalDataProps {
  id?: number | string;
  hideOnWidth?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}
interface CreateRecordModal extends CommonModalDataProps {
  type: MODAL_TYPES.createRecord;
}
interface MonobankTxFormModal extends CommonModalDataProps {
  type: MODAL_TYPES.monobankTxForm;
}
interface MonobankSetTokenModal extends CommonModalDataProps {
  type: MODAL_TYPES.monobankSetToken;
}
interface RecordListModal extends CommonModalDataProps {
  type: MODAL_TYPES.recordList;
  data: RecordListModalProps;
}

export type ModalDataProp =
  | RecordListModal
  | CreateRecordModal
  | MonobankTxFormModal
  | MonobankSetTokenModal;

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
    const index = activeModals.value.findIndex((item) => item.id === modal.id);

    activeModals.value.splice(index, 1);
  };

  return {
    activeModals,
    addModal,
    removeModal,
  };
};
