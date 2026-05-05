import { Meta, StoryObj } from "@storybook/react";

import Component from "./MainLayout";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Layouts/MainLayout",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="border border-neutral-400">
        <Story />
      </div>
    )
  ],
  args: {
    children: <div className="h-[400px] " />
  }
};
