import { Meta, StoryObj } from "@storybook/react";

import { ProgressTag as Component } from "./ProgressTag";

const meta: Meta<typeof Component> = {
  title: "Redesign Components/Actions/Tags/Progress Tag",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const NotStarted: Story = {
  args: {
    state: "not-started"
  }
};

export const InProgress: Story = {
  args: {
    state: "in-progress"
  }
};

export const Completed: Story = {
  args: {
    state: "completed"
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Component state="not-started" />
      <Component state="in-progress" />
      <Component state="completed" />
    </div>
  )
};
