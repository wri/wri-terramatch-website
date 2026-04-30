import { Meta, StoryObj } from "@storybook/react";

import MappedTag from "./MappedTag";

const meta: Meta<typeof MappedTag> = {
  title: "Redesign Components/Actions/Tags/Mapped Tag",
  component: MappedTag
};

export default meta;
type Story = StoryObj<typeof MappedTag>;

export const Draft: Story = {
  args: {
    state: "draft"
  }
};

export const PendingApproval: Story = {
  args: {
    state: "pending-approval"
  }
};

export const InformationRequired: Story = {
  args: {
    state: "information-required"
  }
};

export const Approved: Story = {
  args: {
    state: "approved"
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <MappedTag state="draft" />
      <MappedTag state="pending-approval" />
      <MappedTag state="information-required" />
      <MappedTag state="approved" />
    </div>
  )
};

export const SizeVariations: Story = {
  render: () => (
    <div className="flex gap-4">
      <MappedTag state="approved" size="default" />
      <MappedTag state="approved" size="small" />
    </div>
  )
};
