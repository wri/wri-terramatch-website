import { Meta, StoryObj } from "@storybook/react";

import Text from "@/components/elements/Text/Text";

import Component from "./StatusPill";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/StatusPill",
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
    status: "edit",
    children: (
      <Text variant="text-body-100" className="pt-0.5">
        Draft
      </Text>
    )
  }
};

export const Error: Story = {
  ...Default,
  args: {
    status: "error",
    children: (
      <Text variant="text-body-100" className="pt-0.5">
        Rejected
      </Text>
    )
  }
};

export const Success: Story = {
  ...Default,
  args: {
    status: "success",
    children: (
      <Text variant="text-body-100" className="pt-0.5">
        Approved
      </Text>
    )
  }
};

export const Awaiting: Story = {
  ...Default,
  args: {
    status: "awaiting",
    children: (
      <Text variant="text-body-100" className="pt-0.5">
        Awaiting Review
      </Text>
    )
  }
};

export const Warning: Story = {
  ...Default,
  args: {
    status: "warning",
    children: (
      <Text variant="text-body-100" className="pt-0.5">
        More Info Requested
      </Text>
    )
  }
};
