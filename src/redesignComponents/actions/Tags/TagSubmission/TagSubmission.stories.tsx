import { Meta, StoryObj } from "@storybook/react";

import TagSubmission from "./TagSubmission";

const meta: Meta<typeof TagSubmission> = {
  title: "Redesign Components/Actions/Tags/Tag Submission",
  component: TagSubmission
};

export default meta;
type Story = StoryObj<typeof TagSubmission>;

export const Draft: Story = {
  args: {
    state: "draft"
  }
};

export const NothingReported: Story = {
  args: {
    state: "nothing-reported"
  }
};

export const PendingApprovalNeutral: Story = {
  args: {
    state: "pending-approval-neutral"
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

export const Due: Story = {
  args: {
    state: "due"
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TagSubmission state="draft" />
      <TagSubmission state="nothing-reported" />
      <TagSubmission state="pending-approval-neutral" />
      <TagSubmission state="pending-approval" />
      <TagSubmission state="information-required" />
      <TagSubmission state="approved" />
      <TagSubmission state="due" />
    </div>
  )
};

export const SizeVariations: Story = {
  render: () => (
    <div className="flex gap-4">
      <TagSubmission state="approved" size="default" />
      <TagSubmission state="approved" size="small" />
    </div>
  )
};
