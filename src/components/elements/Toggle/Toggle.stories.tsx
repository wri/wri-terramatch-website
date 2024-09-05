import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Component, { ToggleProps } from "./Toggle";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Toggle",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const ToggleWrapper = (args: ToggleProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-fit">
      <Component {...args} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </div>
  );
};

export const Horizontal: Story = {
  render: args => <ToggleWrapper {...args} />,
  args: {
    items: ["Tab 1", "Tab 2", "Tab 3"]
  }
};
