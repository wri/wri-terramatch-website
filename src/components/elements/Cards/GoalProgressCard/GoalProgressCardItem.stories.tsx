import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import { TranslatedText } from "@/i18n/types";

import Component from "./GoalProgressCardItem";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/GoalProgressCard/Item",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    iconName: IconNames.TRASH_CIRCLE,
    label: "Trash Removed" as TranslatedText,
    value: 530000
  }
};
