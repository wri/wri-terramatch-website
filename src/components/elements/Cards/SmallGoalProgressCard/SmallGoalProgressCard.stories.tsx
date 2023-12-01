import { Meta, StoryObj } from "@storybook/react";

import Component from "./SmallGoalProgressCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/SmallGoalProgressCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => {
      return <Story />;
    }
  ],
  args: {
    value: 123,
    label: "Survival Rate",
    limit: 200
  }
};
