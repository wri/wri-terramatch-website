import { Meta, StoryObj } from "@storybook/react";

import SimpleDivider from "./SimpleDivider";

const meta: Meta<typeof SimpleDivider> = {
  title: "Redesign Components/Miscellaneous/Dividers/SimpleDivider",
  component: SimpleDivider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A simple horizontal divider line component."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof SimpleDivider>;

export const Default: Story = {
  render: () => <SimpleDivider />
};

export const InContext: Story = {
  render: () => (
    <div style={{ padding: "1.25rem", width: "100%" }}>
      <p>Content above the divider</p>
      <SimpleDivider />
      <p>Content below the divider</p>
    </div>
  )
};
