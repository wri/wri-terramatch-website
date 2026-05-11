import { Meta, StoryObj } from "@storybook/react";

import { CheckIndeterminateIcon, ExpandIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";

import MapControls from "./MapControls";

const meta = {
  title: "Redesign Components/Geospatial/Map Controls",
  component: MapControls,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof MapControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: true,
    items: [
      {
        icon: <PlusIcon />,
        ariaLabel: "zoom in",
        label: "Zoom in",
        gap: false
      },
      {
        icon: <CheckIndeterminateIcon />,
        ariaLabel: "zoom out",
        label: "Zoom out"
      },
      {
        icon: <ExpandIcon />,
        ariaLabel: "expand",
        label: "Expand"
      }
    ]
  }
};

export const WithTooltip: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: true,
    items: [
      {
        icon: <ExpandIcon />,
        ariaLabel: "expand",
        disabled: false,
        label: "Expand",
        tooltip: "Expand tooltip"
      },
      {
        icon: <CheckIndeterminateIcon />,
        ariaLabel: "zoom out",
        label: "Zoom out",
        tooltip: "Zoom out tooltip"
      }
    ]
  }
};

export const MapControl: Story = {
  args: {
    items: [
      {
        icon: <PlusIcon />,
        ariaLabel: "zoom in"
      },
      {
        icon: <CheckIndeterminateIcon />,
        ariaLabel: "zoom out"
      }
    ]
  }
};

export const Vertical: Story = {
  args: {
    items: [
      {
        icon: <PlusIcon />,
        ariaLabel: "zoom in"
      },
      {
        icon: <CheckIndeterminateIcon />,
        ariaLabel: "zoom out"
      }
    ],

    vertical: true,
    showExpandedToggle: false
  }
};

export const Single: Story = {
  args: {
    items: [
      {
        icon: <ExpandIcon />,
        label: "Expand",
        ariaLabel: "expand"
      }
    ],

    showExpandedToggle: false,
    expanded: true
  }
};

export const Disabled: Story = {
  args: {
    items: [
      {
        icon: <ExpandIcon />,
        ariaLabel: "Expand",
        disabled: true
      }
    ]
  }
};
