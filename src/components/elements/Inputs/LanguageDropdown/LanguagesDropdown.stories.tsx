import { Meta, StoryObj } from "@storybook/react";

import Component from "./LanguagesDropdown";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/LanguagesDropdown",
  component: Component
};
export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="flex h-[300px] justify-end">
        <Story />
      </div>
    )
  ]
};
