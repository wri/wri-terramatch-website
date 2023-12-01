import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Elements/Buttons",
  component: Button
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary"
  }
};

export const PrimaryDisabled: Story = {
  args: {
    children: "Primary",
    variant: "primary",
    disabled: true
  }
};

export const PrimaryIcon: Story = {
  args: {
    children: "Primary",
    variant: "primary",
    iconProps: {
      name: IconNames.PLUS_THICK,
      width: 12
    }
  }
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary"
  }
};

export const SecondaryDisabled: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
    disabled: true
  }
};

export const SecondaryIcon: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
    iconProps: {
      name: IconNames.PLUS,
      width: 12
    }
  }
};

export const Text: Story = {
  args: {
    children: "Text",
    variant: "text"
  }
};

export const PrimaryLink: Story = {
  args: {
    children: "Primary Link",
    variant: "primary",
    as: "a",
    href: "/"
  }
};

export const DisabledLink: Story = {
  args: {
    children: "Disabled Link",
    variant: "primary",
    as: "a",
    href: "/",
    disabled: true
  }
};
