import { Meta, StoryObj } from "@storybook/react";

import { type TagSubmissionProps } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

import PageHeader from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Redesign Components/Content/Headers/Page Header",
  component: PageHeader,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title text displayed in the page header"
    },
    tag: {
      control: "object",
      description: "Tag submission configuration with state and optional props"
    }
  }
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const SimplePageHeader: Story = {
  args: {
    title: "Page Header",
    tag: {
      state: "approved"
    } as TagSubmissionProps
  }
};

export const Draft: Story = {
  args: {
    title: "Page Header",
    tag: {
      state: "draft"
    } as TagSubmissionProps
  }
};

export const Approved: Story = {
  args: {
    title: "Page Header",
    tag: {
      state: "approved"
    } as TagSubmissionProps
  }
};

export const PendingApproval: Story = {
  args: {
    title: "Page Header",
    tag: {
      state: "pending-approval"
    } as TagSubmissionProps
  }
};

export const InformationRequired: Story = {
  args: {
    title: "Page Header",
    tag: {
      state: "information-required"
    } as TagSubmissionProps
  }
};

export const Due: Story = {
  args: {
    title: "Page Header",
    tag: {
      state: "due"
    } as TagSubmissionProps
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PageHeader title="Page Header" tag={{ state: "draft" } as TagSubmissionProps} />
      <PageHeader title="Page Header" tag={{ state: "nothing-reported" } as TagSubmissionProps} />
      <PageHeader title="Page Header" tag={{ state: "pending-approval-neutral" } as TagSubmissionProps} />
      <PageHeader title="Page Header" tag={{ state: "pending-approval" } as TagSubmissionProps} />
      <PageHeader title="Page Header" tag={{ state: "information-required" } as TagSubmissionProps} />
      <PageHeader title="Page Header" tag={{ state: "approved" } as TagSubmissionProps} />
      <PageHeader title="Page Header" tag={{ state: "due" } as TagSubmissionProps} />
    </div>
  )
};
