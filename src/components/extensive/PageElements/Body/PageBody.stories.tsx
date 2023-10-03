import { Meta, StoryObj } from "@storybook/react";

import Component from "./PageBody";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Body",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="h-[500px]">
        <p>page content</p>
      </div>
    )
  ]
};
