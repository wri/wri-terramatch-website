import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "../Icon/Icon";
import Component from "./ActionTrackerCard";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/ActionTracker/ActionTrackerCard",
  component: Component
};
export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "A title",
    icon: IconNames.LAPTOP_CIRCLE,
    data: [
      {
        title: "Card 1",
        subtitle: "Subtitle",
        status: "awaiting",
        statusText: "Awaiting",
        ctaText: "cta",
        ctaLink: "/"
      },
      {
        title: "Card 2",
        subtitle: "Subtitle",
        status: "edit",
        statusText: "Edit",
        ctaText: "cta",
        ctaLink: "/"
      },
      {
        title: "Card 3",
        subtitle: "Subtitle",
        status: "error",
        statusText: "Error",
        ctaText: "cta",
        ctaLink: "/"
      },
      {
        title: "Card 4",
        subtitle: "Subtitle",
        status: "success",
        statusText: "Success",
        ctaText: "cta",
        ctaLink: "/"
      },
      {
        title: "Card 5",
        subtitle: "Subtitle",
        status: "warning",
        statusText: "Warning",
        ctaText: "cta",
        ctaLink: "/"
      }
    ]
  }
};

export const Empty: Story = {
  args: {
    title: "Empty State",
    icon: IconNames.LAPTOP_CIRCLE,
    data: [],
    emptyState: {
      subtitle: "Empty Subtitle",
      title: "Empty",
      buttonProps: {
        children: "CTA here"
      }
    }
  }
};
