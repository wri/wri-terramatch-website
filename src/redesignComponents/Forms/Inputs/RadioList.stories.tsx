import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";

import RadioList from "./RadioList";

type RadioOption = ComponentProps<typeof RadioList>["radios"][number] & { children: React.ReactNode };

const meta = {
  title: "Redesign Components/Forms/Input/Radio List",
  component: RadioList,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Value of the radio to be selected by default"
    },
    horizontal: {
      control: "boolean",
      description: "Display radios horizontally"
    },
    required: {
      control: "boolean",
      description: "Whether the field is required"
    },
    variant: {
      control: "select",
      options: ["default", "card"],
      description: "Visual variant of the radio list"
    }
  },
  args: {
    onCheckedChange: (name: string, selectedValue: string) => {
      action("onCheckedChange")(name, selectedValue);
    }
  },
  render: args => {
    const [value, setValue] = useState<string | undefined>(args.defaultValue);
    const handleCheckedChange = (name: string, selectedValue: string) => {
      setValue(selectedValue);
      args.onCheckedChange?.(name, selectedValue);
    };
    return <RadioList {...args} defaultValue={value} onCheckedChange={handleCheckedChange} />;
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "25rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof RadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultRadios: RadioOption[] = [
  { value: "option-1", children: "Option 1" },
  { value: "option-2", children: "Option 2" },
  { value: "option-3", children: "Option 3" }
];

export const Default: Story = {
  args: {
    label: "Select an option",
    caption: "Choose one option from the list",
    name: "radio-list-default",
    radios: defaultRadios
  }
};

export const Required: Story = {
  args: {
    label: "Required selection",
    caption: "Please select one option",
    name: "radio-list-required",
    radios: defaultRadios,
    required: true
  }
};

export const Horizontal: Story = {
  args: {
    label: "Inline options",
    caption: "Options displayed horizontally",
    name: "radio-list-horizontal",
    radios: defaultRadios,
    horizontal: true
  }
};

export const WithDefaultValue: Story = {
  args: {
    label: "With Default Value",
    caption: "Option 1 is pre-selected",
    name: "radio-list-default-value",
    radios: defaultRadios,
    defaultValue: "option-1"
  }
};

export const WithError: Story = {
  args: {
    label: "With Error",
    caption: "Please select an option to continue",
    name: "radio-list-error",
    radios: defaultRadios.slice(0, 2),
    errorMessage: "You must select an option to continue",
    required: true
  }
};

export const HorizontalWithError: Story = {
  args: {
    label: "Inline options",
    caption: "Options displayed horizontally",
    name: "radio-list-horizontal-error",
    radios: defaultRadios,
    horizontal: true,
    errorMessage: "You must select an option to continue",
    required: true
  }
};

export const WithDisabledOption: Story = {
  args: {
    label: "With Disabled Option",
    caption: "Option 3 is disabled",
    name: "radio-list-disabled",
    radios: [
      ...defaultRadios.slice(0, 2),
      { value: "option-3", children: "Option 3 (Coming soon)", disabled: true }
    ] as RadioOption[]
  }
};

export const CardVariant: Story = {
  args: {
    label: "Card Variant",
    caption: "Card variant of the radio list",
    name: "radio-list-card",
    defaultValue: "radio-2",
    radios: defaultRadios,
    variant: "card",
    required: true
  },
  render: args => {
    const [value, setValue] = useState<string | undefined>(args.defaultValue);
    const handleCheckedChange = (name: string, selectedValue: string) => {
      setValue(selectedValue);
      args.onCheckedChange?.(name, selectedValue);
    };
    return (
      <div style={{ width: "22.875rem" }}>
        <RadioList {...args} defaultValue={value} onCheckedChange={handleCheckedChange} />
      </div>
    );
  }
};

export const CardVariantWithErrorMessage: Story = {
  args: {
    label: "Card Variant With Error Message",
    caption: "Card variant of the radio list with error message",
    name: "radio-list-card-error",
    defaultValue: "radio-2",
    errorMessage: "Error Message",
    radios: defaultRadios,
    variant: "card",
    required: true
  },
  render: args => {
    const [value, setValue] = useState<string | undefined>(args.defaultValue);
    const handleCheckedChange = (name: string, selectedValue: string) => {
      setValue(selectedValue);
      args.onCheckedChange?.(name, selectedValue);
    };
    return (
      <div style={{ width: "22.875rem" }}>
        <RadioList {...args} defaultValue={value} onCheckedChange={handleCheckedChange} />
      </div>
    );
  }
};
