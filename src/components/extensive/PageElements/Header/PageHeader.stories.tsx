import { Meta, StoryObj } from "@storybook/react";

import Component from "./PageHeader";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Header",
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
    className: "min-h-[230px]",
    title: "Page title"
  }
};
