import { Meta, StoryObj } from "@storybook/react";

import Log from "@/utils/log";

import Component from "./PerPageSelector";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Table/PerPageSelector",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="w-fit">
        <Story />
      </div>
    )
  ],
  args: { options: [5, 10, 15, 20, 50], onChange: Log.info, defaultValue: 5 }
};
