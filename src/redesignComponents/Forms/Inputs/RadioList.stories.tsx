import type { Meta, StoryObj } from "@storybook/react";

import RadioList from "./RadioList";

const meta = {
  title: "Redesign Components/Forms/Input/RadioList",
  component: RadioList,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onCheckedChange: () => {} },
  decorators: [
    (Story: any) => (
      <div style={{ width: "366px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof RadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    name: "radio-list-1",
    radios: [
      {
        children: "Radio 1",
        value: "radio-1"
      },
      {
        children: "Radio 2",
        value: "radio-2"
      },
      {
        children: "Radio 3",
        value: "radio-3"
      }
    ],
    required: true
  }
};

export const WithDefaultValue: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    name: "radio-list-2",
    defaultValue: "radio-2",
    radios: [
      {
        children: "Radio 1",
        value: "radio-1"
      },
      {
        children: "Radio 2",
        value: "radio-2"
      },
      {
        children: "Radio 3",
        value: "radio-3"
      }
    ],
    required: true
  }
};

export const Horizontal: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    name: "radio-list-3",
    defaultValue: "radio-2",
    radios: [
      {
        children: "Radio 1",
        value: "radio-1"
      },
      {
        children: "Radio 2",
        value: "radio-2"
      },
      {
        children: "Radio 3",
        value: "radio-3"
      }
    ],
    required: true,
    horizontal: true
  }
};

export const WithErrorMessage: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    name: "radio-list-2",
    defaultValue: "radio-2",
    errorMessage: "Error Message",
    radios: [
      {
        children: "Radio 1",
        value: "radio-1"
      },
      {
        children: "Radio 2",
        value: "radio-2"
      },
      {
        children: "Radio 3",
        value: "radio-3"
      }
    ],
    required: true
  }
};

export const CardVariant: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    name: "radio-list-2",
    defaultValue: "radio-2",
    radios: [
      {
        children: "Radio 1",
        value: "radio-1"
      },
      {
        children: "Radio 2",
        value: "radio-2"
      },
      {
        children: "Radio 3",
        value: "radio-3"
      }
    ],
    variant: "card",
    required: true
  },
  render: args => (
    <div style={{ width: "366px" }}>
      <RadioList {...args} />
    </div>
  )
};

export const CardVariantWithErrorMessage: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    name: "radio-list-2",
    defaultValue: "radio-2",
    errorMessage: "Error Message",
    radios: [
      {
        children: "Radio 1",
        value: "radio-1"
      },
      {
        children: "Radio 2",
        value: "radio-2"
      },
      {
        children: "Radio 3",
        value: "radio-3"
      }
    ],
    variant: "card",
    required: true
  },
  render: args => (
    <div style={{ width: "366px" }}>
      <RadioList {...args} />
    </div>
  )
};
