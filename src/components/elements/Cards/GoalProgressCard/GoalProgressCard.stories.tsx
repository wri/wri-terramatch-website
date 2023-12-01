import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "@/components/extensive/Icon/Icon";

import Component from "./GoalProgressCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/GoalProgressCard/Card",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const args = {
  noProgressOrItems: {
    value: 150,
    label: "Hectors Restored"
  },
  progressNoItems: {
    value: 75,
    limit: 150,
    label: "Workday (PPC)"
  },
  progressAndItems: {
    value: 600,
    limit: 732,
    label: "Trees Restored",
    items: [
      {
        iconName: IconNames.BRANCH_CIRCLE,
        label: "Organisations Joined",
        value: 23
      },
      {
        iconName: IconNames.TREE_CIRCLE,
        label: "Trees Planed",
        value: 1332
      },
      {
        iconName: IconNames.TRASH_CIRCLE,
        label: "Trash Removed ",
        value: 530000
      }
    ]
  }
};

export const NoProgressOrItems: Story = {
  decorators: [
    Story => {
      return (
        <div className="h-44 p-4">
          <Story />
        </div>
      );
    }
  ],
  args: args.noProgressOrItems
};

export const ProgressNoItems: Story = {
  decorators: [
    Story => {
      return (
        <div className="h-44 p-4">
          <Story />
        </div>
      );
    }
  ],
  args: args.progressNoItems
};

export const ProgressAndItems: Story = {
  decorators: [
    Story => {
      return (
        <div className="h-44 p-4">
          <Story />
        </div>
      );
    }
  ],
  args: args.progressAndItems
};
