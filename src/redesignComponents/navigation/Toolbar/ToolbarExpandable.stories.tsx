import { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import ToolbarExpandable from "./ToolbarExpandable";

const meta: Meta<typeof ToolbarExpandable> = {
  title: "Redesign Components/Navigation/Toolbar/Expandable Toolbar",
  component: ToolbarExpandable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    Story => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#F5F5F5",
          padding: "1.25rem",
          borderRadius: "0.5rem"
        }}
      >
        <div>
          <Story />
        </div>
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ToolbarExpandable>;

export const Default: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    items: [
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      },
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      },
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      },
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      },
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      },
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      },
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "label",
        label: "label"
      }
    ]
  }
};

export const Expanded: Story = {
  args: {
    ...Default.args,
    expanded: true
  }
};
export const Horizontal: Story = {
  args: {
    ...Default.args,
    vertical: false
  }
};

export const AutoCollapsed: Story = {
  args: {
    items: Default.args?.items,
    vertical: false,
    autoCollapse: true,
    showExpandedToggle: false,
    expanded: false,
    defaultGaps: false
  },
  decorators: [
    Story => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "300px" }}>
          <Story />
        </div>
      </div>
    )
  ]
};
