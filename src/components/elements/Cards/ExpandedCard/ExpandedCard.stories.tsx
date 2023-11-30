import { Meta, StoryObj } from "@storybook/react";

import Component from "./ExpandedCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/ExpandedCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    headerChildren: <p>Header</p>,
    children: <p>Body</p>
  }
};
