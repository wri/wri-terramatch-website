import { Meta, StoryObj } from "@storybook/react";

import Text from "@/components/elements/Text/Text";

import { ModalConfirmProps as Props } from "./ModalConfirm";
import Component from "./ModalConfirm";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Modal/ModalConfirm",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <div className="flex items-center justify-center bg-primary-400 p-8">
      <Component {...args} />
    </div>
  ),
  args: {
    title: "Confirm Site Status Change",
    commentArea: true,
    content: (
      <Text variant="text-14-light" className="text-center">
        Are you sure you want to change the site status to Restoration In Progress?
      </Text>
    ),
    onClose: () => {},
    onConfirm: () => {}
  }
};
