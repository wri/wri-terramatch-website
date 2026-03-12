import { Meta, StoryObj } from "@storybook/react";

import MapControls from "./MapControls";

const meta: Meta<typeof MapControls> = {
  title: "Redesign Components/Geospatial/MapControls",
  component: MapControls,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    Story => (
      <div style={{ backgroundColor: "#E8E8E8", padding: "40px", borderRadius: "8px" }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof MapControls>;

export const Default: Story = {};
