import type { Meta, StoryObj } from "@storybook/react";

import { InfoIcon } from "../../foundations/Icons";
import TooltipStory from "./Tooltip";

const meta = {
  title: "Redesign Components/Actions/Tooltip",
  component: TooltipStory,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "gray",
      values: [
        {
          name: "gray",
          value: "#F5F5F5"
        }
      ]
    }
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tooltip relative to the trigger element"
    }
  }
} satisfies Meta<typeof TooltipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tooltip: Story = {
  args: {
    content: "Tooltip content",
    children: <InfoIcon height="0.25rem" width="0.25rem" />
  }
};

export const TextVariant: Story = {
  args: {
    content: "Tooltip content",
    children: <InfoIcon height="0.25rem" width="0.25rem" />,
    variant: "text"
  }
};

export const AnyContent: Story = {
  args: {
    content: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.3125rem",
          fontSize: "0.875rem",
          lineHeight: "1.25rem"
        }}
      >
        <InfoIcon height="0.25rem" width="0.25rem" />
        This is a tooltip
      </div>
    ),
    children: <InfoIcon height="0.25rem" width="0.25rem" />
  }
};

export const Position: Story = {
  args: {
    content: "Tooltip content",
    children: <InfoIcon height="0.25rem" width="0.25rem" />,
    position: "right"
  }
};

export const Delay: Story = {
  args: {
    content: "Tooltip content",
    children: <InfoIcon height="0.25rem" width="0.25rem" />,
    openDelay: 500,
    closeDelay: 2000
  }
};
