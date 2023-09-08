import { Meta, StoryObj } from "@storybook/react";

import Component from "./Pill";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Pill",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="flex items-start justify-start">
        <Story />
      </div>
    )
  ],
  args: {
    children: "Pill children",
    className: "bg-tertiary"
  }
};

export const Primary: Story = {
  ...Default,
  args: { children: "Primary", className: "bg-primary-200" }
};

export const Neutral: Story = {
  ...Default,
  args: { children: "Neutral", className: "bg-neutral-200" }
};

export const Secondary: Story = {
  ...Default,
  args: {
    children: "Secondary",
    className: "bg-secondary-200"
  }
};

export const Tertiary: Story = {
  ...Default,
  args: {
    children: "Tertiary",
    className: "bg-tertiary-200"
  }
};

export const Success: Story = {
  ...Default,
  args: { children: "success", className: "bg-success-200" }
};

export const Error: Story = {
  ...Default,
  args: { children: "Error", className: "bg-error-200" }
};
