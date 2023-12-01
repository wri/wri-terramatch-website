import { Meta, StoryObj } from "@storybook/react";

import Component, { ImageCreditProps as Props } from "./ImageCredit";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ImageCredit",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  render: (args: Props) => (
    <div className="relative flex aspect-[16/9] h-[400px] items-start justify-start bg-terrafundAfr100 bg-cover bg-no-repeat">
      <Component {...args} />
    </div>
  ),
  args: {
    children: "Milad Dehghani",
    className: "bottom-0 right-5 absolute"
  }
};
