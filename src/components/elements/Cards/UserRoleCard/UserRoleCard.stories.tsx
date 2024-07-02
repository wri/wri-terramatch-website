import { Meta, StoryObj } from "@storybook/react";

import Component, { UserRoleCardProps as Props } from "./UserRoleCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/UserRoleCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <div className="p-4">
      <Component {...args} />
    </div>
  ),
  args: {
    title: "I’m a Funder/Investor",
    description: "Evaluate ROI, aid strategic investment decisions and guide funding priorities.",
    options: [
      { id: "1", data: { label: "ppc" }, render: () => null },
      { id: "2", data: { label: "terrafund" }, render: () => null }
    ],
    titleOptions: "Select Framework",
    selected: true
  }
};
