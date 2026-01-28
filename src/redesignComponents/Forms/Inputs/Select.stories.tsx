import { Meta, StoryObj } from "@storybook/react";

import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "Redesign Components/Forms/Input/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
      description: "Whether the select is required"
    },
    size: {
      control: "select",
      options: ["small", "default"],
      description: "Size of the select"
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled"
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the select"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" }
];

export const Default: Story = {
  render: args => (
    <Select
      {...args}
      label="Country"
      placeholder="Select a country"
      name="country"
      items={options}
      onChange={() => {}}
    />
  )
};

export const MultiSelect: Story = {
  render: args => (
    <Select
      {...args}
      label="Interests"
      placeholder="Select your interests"
      name="interests"
      items={options}
      multiple={true}
      onChange={() => {}}
    />
  )
};

export const DefaultValue: Story = {
  render: args => (
    <Select
      {...args}
      label="Language"
      placeholder="Select language"
      defaultValue={["option2"]}
      name="language"
      items={options}
      onChange={() => {}}
    />
  )
};

export const SmallSize: Story = {
  render: args => (
    <Select
      {...args}
      label="Category"
      placeholder="Select category"
      size="small"
      name="category"
      items={options}
      onChange={() => {}}
    />
  )
};

export const Disabled: Story = {
  render: args => (
    <Select
      {...args}
      label="Status"
      placeholder="Select status"
      disabled={true}
      defaultValue={["option1"]}
      name="status"
      items={options}
      onChange={() => {}}
    />
  )
};

export const ErrorMessage: Story = {
  render: args => (
    <Select
      {...args}
      label="Region"
      placeholder="Select a region"
      caption="Please select a valid region"
      name="region"
      items={options}
      onChange={() => {}}
      errorMessage="Please select a valid region"
    />
  )
};
