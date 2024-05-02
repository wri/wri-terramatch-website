import { Meta, StoryObj } from "@storybook/react";

import { ComentaryBoxProps as Props } from "./ComentaryBox";
import Component from "./ComentaryBox";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ComentaryBox",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <div className="flex items-center justify-center p-8">
      <Component {...args} />
    </div>
  ),
  args: {
    name: "Ricardo",
    lastName: "Saavedra",
    buttonSendOnBox: true
  }
};
