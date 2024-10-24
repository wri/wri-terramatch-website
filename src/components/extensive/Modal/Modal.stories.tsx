import { Meta, StoryObj } from "@storybook/react";

import Log from "@/utils/log";

import { IconNames } from "../Icon/Icon";
import Component, { ModalProps as Props } from "./Modal";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Modal",
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
    title: "Are you sure?",
    content:
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the 'My Applications' section.Would you like to close this form and continue later?",
    iconProps: {
      name: IconNames.INFO_CIRCLE,
      className: "fill-error"
    },
    primaryButtonProps: {
      children: "Close and continue later",
      onClick: () => Log.info("close clicked")
    },
    secondaryButtonProps: {
      children: "Cancel",
      onClick: () => Log.info("secondary clicked")
    }
  }
};
