import { Meta, StoryObj } from "@storybook/react";

import TextInput from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Redesign Components/Forms/Input/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
      description: "Whether the input is required"
    },
    size: {
      control: "select",
      options: ["small", "default"],
      description: "Size of the input"
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled"
    },
    defaultValue: {
      control: "text",
      description: "Default value for the input"
    }
  }
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const RequiredInput: Story = {
  args: {
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
    name: "fullName"
  }
};

export const OptionalInput: Story = {
  args: {
    label: "Company Name",
    placeholder: "Enter your company name (optional)",
    required: false,
    name: "companyName"
  }
};

export const SmallInput: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    size: "small",
    name: "username"
  }
};

export const DefaultValue: Story = {
  args: {
    label: "Email Address",
    placeholder: "Enter your email",
    defaultValue: "user@example.com",
    name: "email"
  }
};

export const WithError: Story = {
  args: {
    label: "Password",
    required: true,
    placeholder: "Enter your password",
    caption: "Password must be at least 8 characters long",
    name: "password",
    errorMessage: "Password must be at least 8 characters long"
  }
};

export const Disabled: Story = {
  args: {
    label: "Account Number",
    placeholder: "Account number",
    disabled: true,
    defaultValue: "ACC-12345",
    name: "accountNumber"
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "25rem" }}>
      <TextInput label="Required Input" placeholder="This field is required" required name="required" />
      <TextInput label="Optional Input" placeholder="This field is optional" name="optional" />
      <TextInput label="Small Input" placeholder="Small size input" size="small" name="small" />
      <TextInput
        label="Input with Default Value"
        placeholder="Has default value"
        defaultValue="Default text here"
        name="default"
      />
      <TextInput
        label="Input with Error"
        placeholder="This has an error"
        caption="This field has an error message"
        name="error"
      />
      <TextInput
        label="Disabled Input"
        placeholder="This is disabled"
        disabled
        defaultValue="Disabled value"
        name="disabled"
      />
    </div>
  )
};
