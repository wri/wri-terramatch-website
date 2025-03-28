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
      <Component {...args} onChangeActiveIndex={setActiveIndex} />
      {activeIndex === 0 && <div>Tab 1</div>}
      {activeIndex === 1 && <div>Tab 2</div>}
      {activeIndex === 2 && <div>Tab 3</div>}
    </div>
  );
};

export const Horizontal: Story = {
  render: args => <ToggleWrapper {...args} />,
  args: {
    items: [
      { key: "Tab 1", render: '"Tab 1"' },
      { key: "Tab 2", render: '"Tab 2"' },
      { key: "Tab 3", render: '"Tab 3"' }
    ]
  }
};
