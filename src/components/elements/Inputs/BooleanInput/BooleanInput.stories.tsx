import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import Component from "./BooleanInput";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/BooleanInput",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: args => {
    const formHook = useForm();
    return <Component {...args} control={formHook.control} formHook={formHook} />;
  },
  args: {
    name: "boolean-input",
    label: "Input Label",
    description: "Input description"
  }
};
