import { HStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import PointMarker from "./PointMarker";

const meta = {
  title: "Redesign Components/Geospatial/PointMarker",
  component: PointMarker,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the marker"
    },
    variant: {
      control: "select",
      options: ["simple-pin", "icon", "cluster"],
      description: "Visual variant of the marker"
    },
    mode: {
      control: "select",
      options: ["light", "dark"],
      description: "Color mode of the marker"
    },
    backgroundColor: {
      control: "color",
      description: "Custom background color for the marker"
    },
    count: {
      control: { type: "number", min: 0 },
      description: "Cluster count displayed on the marker"
    },
    showFocusState: {
      control: "boolean",
      description: "Whether to show the focus ring around the marker"
    }
  }
} satisfies Meta<typeof PointMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconVariant: Story = {
  args: {
    ariaLabel: "Icon marker",
    variant: "icon",
    icon: <PlaceholderIcon color="neutral.100" />,
    backgroundColor: "#8ECA3FCC"
  }
};

export const Cluster: Story = {
  args: {
    ariaLabel: "Cluster marker",
    variant: "cluster",
    count: 12,
    backgroundColor: "neutral.100"
  }
};

export const WithFocusState: Story = {
  args: {
    ariaLabel: "Focused marker",
    variant: "icon",
    icon: <PlaceholderIcon color="neutral.100" />,
    backgroundColor: "#8ECA3FCC",
    showFocusState: true
  }
};

export const HighClusterCount: Story = {
  args: {
    ariaLabel: "High count cluster",
    variant: "cluster",
    count: 999,
    backgroundColor: "neutral.100"
  }
};

export const AllVariants: Story = {
  render: () => (
    <HStack gap={6} flexWrap="wrap" alignItems="center">
      <div style={{ textAlign: "center" }}>
        <PointMarker
          ariaLabel="Icon"
          variant="icon"
          icon={<PlaceholderIcon color="neutral.100" />}
          backgroundColor="#8ECA3FCC"
        />
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666" }}>Icon</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <PointMarker ariaLabel="Cluster" variant="cluster" count={22} backgroundColor="neutral.100" />
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666" }}>Cluster</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <PointMarker
          ariaLabel="Focused"
          variant="icon"
          icon={<PlaceholderIcon color="neutral.100" />}
          showFocusState
          backgroundColor="#8ECA3FCC"
        />
        <p style={{ marginTop: "0.5rem", fontSize: "0.625rem", color: "#666" }}>Focus</p>
      </div>
    </HStack>
  )
};

export const AllClusterCount: Story = {
  render: () => (
    <HStack gap={6} flexWrap="wrap" alignItems="center">
      <div style={{ textAlign: "center" }}>
        <PointMarker ariaLabel="Cluster" variant="cluster" count={9} backgroundColor="neutral.100" />
      </div>
      <div style={{ textAlign: "center" }}>
        <PointMarker ariaLabel="Cluster" variant="cluster" count={50} backgroundColor="neutral.100" />
      </div>
      <div style={{ textAlign: "center" }}>
        <PointMarker ariaLabel="Cluster" variant="cluster" count={99} backgroundColor="neutral.100" />
      </div>
      <div style={{ textAlign: "center" }}>
        <PointMarker ariaLabel="Cluster" variant="cluster" count={999} backgroundColor="neutral.100" />
      </div>
    </HStack>
  )
};
