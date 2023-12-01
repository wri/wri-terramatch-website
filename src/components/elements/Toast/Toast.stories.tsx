import { Meta, StoryObj } from "@storybook/react";

import ToastProvider, { ToastType, useToastContext } from "@/context/toast.provider";

import Button from "../Button/Button";
import Component from "./Toast";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Toast",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const Trigger = ({ type, text }: { type: ToastType; text: string }) => {
  const { openToast } = useToastContext();
  return <Button onClick={() => openToast(text, type)}>Trigger</Button>;
};

export const Success: Story = {
  decorators: [
    Story => (
      <ToastProvider>
        <Trigger type={ToastType.SUCCESS} text="Great Success!" />
        <div className="relative m-4">
          <Story />
        </div>
      </ToastProvider>
    )
  ]
};

export const Error: Story = {
  decorators: [
    Story => (
      <ToastProvider>
        <Trigger type={ToastType.ERROR} text="Oops. A problem!" />
        <div className="relative m-4">
          <Story />
        </div>
      </ToastProvider>
    )
  ]
};
