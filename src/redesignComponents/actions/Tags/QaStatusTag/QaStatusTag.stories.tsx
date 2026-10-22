import { Meta, StoryObj } from "@storybook/react";

import QaStatusTag from "./QaStatusTag";

const meta: Meta<typeof QaStatusTag> = {
  title: "Redesign Components/Actions/Tags/QA Status Tag",
  component: QaStatusTag
};

export default meta;
type Story = StoryObj<typeof QaStatusTag>;

export const QaInProgress: Story = {
  args: {
    status: "qa-in-progress"
  }
};

export const QaCompleted: Story = {
  args: {
    status: "qa-completed"
  }
};

export const NoDataSubmitted: Story = {
  args: {
    status: "no-data-submitted"
  }
};

export const NoDataExpected: Story = {
  args: {
    status: "no-data-expected"
  }
};

export const Small: Story = {
  args: {
    status: "qa-completed",
    size: "small"
  }
};
