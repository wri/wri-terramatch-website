import { Meta, StoryObj } from "@storybook/react";

import Component from "./Text";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Text",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Body100: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    variant: "text-body-100"
  }
};

export const Body200: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-200"
  }
};

export const Body300: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-300"
  }
};

export const Body400: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-400"
  }
};

export const Body500: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-500"
  }
};

export const Body600: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-600"
  }
};

export const Body700: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-700"
  }
};

export const Body800: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-800"
  }
};

export const Body900: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-900"
  }
};

export const Body1000: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-1000"
  }
};

export const Body1100: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-1100"
  }
};

export const Body1200: Story = {
  args: {
    ...Body100.args,
    variant: "text-body-1200"
  }
};

export const Heading100: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-100"
  }
};

export const Heading200: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-200"
  }
};

export const Heading300: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-300"
  }
};

export const Heading400: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-400"
  }
};

export const Heading500: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-500"
  }
};

export const Heading600: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-600"
  }
};

export const Heading700: Story = {
  args: {
    ...Body100.args,
    variant: "text-heading-700"
  }
};

export const Button100: Story = {
  args: {
    ...Body100.args,
    variant: "text-button-100"
  }
};

export const Button200: Story = {
  args: {
    ...Body100.args,
    variant: "text-button-200"
  }
};

export const Button300: Story = {
  args: {
    ...Body100.args,
    variant: "text-button-300"
  }
};

export const Button400: Story = {
  args: {
    ...Body100.args,
    variant: "text-button-400"
  }
};
