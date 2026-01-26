import { Meta, StoryObj } from "@storybook/react";
import { Password } from "@worldresources/wri-design-systems";

const meta: Meta<typeof Password> = {
  title: "Redesign Components/Forms/Input/Password",
  component: Password,
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
      description: "Whether the password input is required"
    },
    minLength: {
      control: "number",
      description: "Minimum character length for the password"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Password>;

export const Default: Story = {
  args: {
    label: "Password"
  }
};

export const RulesDisabled: Story = {
  args: {
    label: "Password",
    disabledRules: {
      uppercase: false,
      lowercase: false,
      numbers: false,
      specialCharacters: false
    }
  }
};

export const CustomMinCharacters: Story = {
  args: {
    label: "Password",
    minLength: 8
  }
};

export const NoValidations: Story = {
  args: {
    label: "Password",
    disabledRules: {
      uppercase: false,
      lowercase: false,
      numbers: false,
      specialCharacters: false
    },
    minLength: 0
  }
};
