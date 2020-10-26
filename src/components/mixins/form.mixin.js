import { validationMixin } from 'vuelidate';

import FormValidationMixin from '@/components/mixins/form-validation.mixin';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import TextareaField from '@/components/fields/TextareaField';
import TickField from '@/components/fields/TickField';

export default {
  components: {
    InputField,
    SelectField,
    TextareaField,
    TickField,
  },
  mixins: [FormValidationMixin, validationMixin],
  data: () => ({
    formMixin: {
      isDisabled: false,
      isPending: false,
      isConfirmationShown: false,
    },
  }),
  methods: {
    disableForm() {
      this.formMixin.isDisabled = true;
    },
    enableForm() {
      this.formMixin.isDisabled = false;
    },
    showConfirmation() {
      this.disableForm();
      this.formMixin.isConfirmationShown = true;
    },
    hideConfirmation() {
      this.enableForm();
      this.formMixin.isConfirmationShown = false;
    },
    async hideConfirmationAfterSubmit(submit) {
      this.formMixin.isPending = true;
      await submit();
      this.hideConfirmation();
      this.formMixin.isPending = false;
    },
  },
};
