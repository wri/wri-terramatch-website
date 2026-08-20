import { Meta, StoryObj } from "@storybook/react";

import Button from "@/components/elements/Button/Button";

import Component from "./StatusBar";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/StatusBar",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const children = (
  <div className="flex gap-3">
    <Button variant="secondary">View Feedback</Button>
    <Button variant="secondary">Learn More</Button>
    <Button>Setup Project</Button>
  </div>
);

const description =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

export const Default: Story = {
  decorators: [
    Story => (
      <div className="flex items-start justify-start">
        <Story />
      </div>
    )
  ],
  args: {
    status: "approved",
    children,
    description
  }
};

export const Due: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "due"
  }
};

export const Draft: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "draft"
  }
};

export const PendingApproval: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "pending-approval"
  }
};

export const InformationRequired: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "information-required"
  }
};

export const NotSelected: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "rejected"
  }
};

export const NothingReported: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "nothing-to-report"
  }
};

export const Restoration: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "restoration"
  }
};
