import type { Meta, StoryObj } from "@storybook/react";

import InputWithUnits from "./InputWithUnits";

const meta = {
  title: "Redesign Components/Forms/Input/InputWithUnits",
  component: InputWithUnits,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onChange: () => {} },
  decorators: [
    (Story: any) => (
      <div style={{ width: "23.125rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof InputWithUnits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Weight",
    caption: "Enter weight in your preferred unit",
    units: [
      {
        label: "kg",
        value: "kg"
      },
      {
        label: "g",
        value: "g"
      },
      {
        label: "lb",
        value: "lb"
      }
    ],
    required: true
  }
};

export const InputWithUnitsLeft: Story = {
  args: {
    label: "Price",
    caption: "Enter price in your preferred currency",
    units: [
      {
        label: "USD",
        value: "USD"
      },
      {
        label: "EUR",
        value: "EUR"
      },
      {
        label: "GBP",
        value: "GBP"
      },
      {
        label: "JPY",
        value: "JPY"
      }
    ],
    unitsPosition: "start",
    required: true
  }
};

export const WithDefaultValue: Story = {
  args: {
    label: "Distance",
    caption: "Enter distance in your preferred unit",
    units: [
      {
        label: "km",
        value: "km"
      },
      {
        label: "m",
        value: "m"
      },
      {
        label: "mi",
        value: "mi"
      }
    ],
    defaultValue: "100",
    defaultUnit: "km",
    required: true
  }
};

export const WithErrorMessage: Story = {
  args: {
    label: "Temperature",
    caption: "Enter temperature in your preferred unit",
    units: [
      {
        label: "°C",
        value: "C"
      },
      {
        label: "°F",
        value: "F"
      },
      {
        label: "K",
        value: "K"
      }
    ],
    errorMessage: "Please enter a valid temperature",
    required: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Height",
    caption: "Enter height in your preferred unit",
    units: [
      {
        label: "cm",
        value: "cm"
      },
      {
        label: "m",
        value: "m"
      },
      {
        label: "ft",
        value: "ft"
      },
      {
        label: "in",
        value: "in"
      }
    ],
    defaultValue: "180",
    defaultUnit: "cm",
    disabled: true,
    required: true
  }
};
