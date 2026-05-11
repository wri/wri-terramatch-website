import { Meta, StoryObj } from "@storybook/react";

import EllipsisDivider from "./EllipsisDivider";

const meta: Meta<typeof EllipsisDivider> = {
  title: "Redesign Components/Miscellaneous/Dividers/EllipsisDivider",
  component: EllipsisDivider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A simple dot/ellipsis divider component with neutral.900 color."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof EllipsisDivider>;

export const Default: Story = {
  render: () => <EllipsisDivider />
};

export const InContext: Story = {
  render: () => (
    <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>Item 1</span>
      <EllipsisDivider />
      <span>Item 2</span>
      <EllipsisDivider />
      <span>Item 3</span>
    </div>
  )
};
