import Button, { THEMES, SIZES, BUTTON_TYPES } from './Button.vue';

interface Args {
  size?: SIZES;
  theme?: THEMES;
  type?: BUTTON_TYPES;
  disabled?: boolean;
  withShadow?: boolean;
  isText?: boolean;
  outline?: boolean;
  slotContent?: string;
}

interface Story {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Args // Optional since args is defined after function declaration
}

// 👇 This default export determines where your story goes in the story list
export default {
  title: 'Button',
  component: Button,
};

// 👇 We create a “template” of how args map to rendering
const Template = (args: Args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args">{{ args.slotContent || "Button" }}</Button>',
});

export const Default = Template.bind({}) as Story;
Default.args = {};

export const Disabled = Template.bind({}) as Story;
Disabled.args = {
  disabled: true,
};

export const Outline = Template.bind({}) as Story;
Outline.args = {
  outline: true,
};
