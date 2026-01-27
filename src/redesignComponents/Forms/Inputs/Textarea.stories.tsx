import type { Meta, StoryObj } from "@storybook/react";

import Textarea from "./Textarea";

const meta = {
  title: "Redesign Components/Forms/Input/Text Area",
  component: Textarea,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RequiredTextarea: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    required: true
  }
};

export const OptionalTextarea: Story = {
  args: {
    label: "Label",
    caption: "Caption"
  }
};

export const SmallTextarea: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    size: "small",
    required: true
  }
};

export const DefaultValue: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    defaultValue: "Default Value",
    required: true
  }
};

export const ErrorMessage: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    errorMessage: "Error Message",
    required: true
  }
};

export const MaxLength: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    maxLength: 200,
    required: true
  }
};

export const MinLength: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    minLength: 5,
    required: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    required: true,
    disabled: true
  }
};
