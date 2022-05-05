import InputField from './InputField.vue';

interface Args {
  label?: string;
  modelValue?: string | number;
  type?: string;
  tabindex?: string;
  errorMessage?: string;
  inputFieldStyles?: unknown;
  subLabelSlot?: string;
  placeholder?: string;
}

interface Story {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Args // Optional since args is defined after function declaration
}

// 👇 This default export determines where your story goes in the story list
export default {
  title: 'InputField',
  component: InputField,
};

// 👇 We create a “template” of how args map to rendering
const Template = (args: Args) => ({
  components: { InputField },
  setup() {
    return { args };
  },
  template: `
    <InputField v-bind="args">
      <template #subLabel>
        {{ args.subLabelSlot }}
      </template>
    </InputField>
  `,
});

export const Default = Template.bind({}) as Story;
Default.args = {
  placeholder: 'Placeholder',
};

export const WithLabel = Template.bind({}) as Story;
WithLabel.args = {
  placeholder: 'Placeholder',
  label: 'Field label',
};

export const SubLabelSlot = Template.bind({}) as Story;
SubLabelSlot.args = {
  label: 'Field label',
  subLabelSlot: 'Sublabel',
};

export const Invalid = Template.bind({}) as Story;
Invalid.args = {
  errorMessage: 'Error message',
};

export const WithValue = Template.bind({}) as Story;
WithValue.args = {
  modelValue: 'Test value',
};

export const TypeNumber = Template.bind({}) as Story;
TypeNumber.args = {
  type: 'number',
};
