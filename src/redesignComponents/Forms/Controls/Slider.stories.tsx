import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Slider from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Redesign Components/Forms/Controls/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: "number"
    },
    max: {
      control: "number"
    },
    step: {
      control: "number"
    },
    disabled: {
      control: "boolean"
    }
  }
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1
  },
  render: args => {
    const [value, setValue] = useState<number[]>([50]);

    const handleChange = (newValue: unknown) => {
      if (Array.isArray(newValue)) {
        setValue(newValue as number[]);
        return;
      }

      if (typeof newValue === "number") {
        setValue([newValue]);
        return;
      }

      const maybeTargetValue = (newValue as any)?.target?.value;
      if (typeof maybeTargetValue !== "undefined") {
        const numericValue = Number(maybeTargetValue);
        if (!Number.isNaN(numericValue)) {
          setValue([numericValue]);
        }
      }
    };

    return (
      <div style={{ width: "20rem", padding: "1.5rem" }}>
        <Slider {...args} value={value} onChange={handleChange} />
      </div>
    );
  }
};

export const Discrete: Story = {
  args: {
    width: "15.625rem",
    min: 0,
    max: 100,
    value: [50],
    marks: [
      { value: 0, label: 0 },
      { value: 25, label: 25 },
      { value: 50, label: 50 },
      { value: 75, label: 75 },
      { value: 100, label: 100 }
    ]
  }
};

export const DiscreteWithSteps: Story = {
  args: {
    width: "15.625rem",
    min: 0,
    max: 100,
    value: [50],
    marks: [
      { value: 0, label: 0 },
      { value: 25, label: 25 },
      { value: 50, label: 50 },
      { value: 75, label: 75 },
      { value: 100, label: 100 }
    ],
    step: 25
  }
};

export const Range: Story = {
  args: {
    width: "15.625rem",
    min: 0,
    max: 100,
    value: [20, 80]
  }
};

export const Centred: Story = {
  args: {
    width: "15.625rem",
    min: 0,
    max: 100,
    value: [50],
    isCentred: true
  }
};

export const Disabled: Story = {
  args: {
    width: "15.625rem",
    min: 0,
    max: 100,
    step: 10,
    disabled: true
  }
};
