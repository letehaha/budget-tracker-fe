import Button, { THEMES, SIZES } from './Button.vue';

interface Story {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any // Optional since args is defined after function declaration
}

// 👇 This default export determines where your story goes in the story list
export default {
  title: 'Button',
  component: Button,
};

// 👇 We create a “template” of how args map to rendering
const Template = (args: {
  size?: SIZES;
  theme?: THEMES;
  type?: BUTTON_TYPES;
  disabled?: boolean;
  withShadow?: boolean;
  isText?: boolean;
  outline?: boolean;
  slotContent?: string;
}) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args">{{ args.slotContent || "Button" }}</Button>',
});

export const Default = Template.bind({}) as Story;
Default.args = {};
