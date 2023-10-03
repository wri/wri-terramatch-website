import { Meta, StoryObj } from "@storybook/react";

import Component from "./PageCard";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Card",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="h-[500px]">
        <Story />
      </div>
    )
  ],
  args: {
    title: "Card title",
    subtitle: "Card subtitle"
  }
};
