import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@worldresources/wri-design-systems";
import { useState } from "react";

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
      <div style={{ width: "320px", padding: "24px" }}>
        <Slider {...args} value={value} onChange={handleChange} />
      </div>
    );
  }
};

export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    step: 10,
    disabled: true
  },
  render: args => {
    const [value] = useState<number[]>([40]);

    return (
      <div style={{ width: "320px", padding: "24px" }}>
        <Slider {...args} value={value} />
        <div style={{ marginTop: "12px", fontSize: "14px" }}>Disabled slider (value: {value.join(", ")})</div>
      </div>
    );
  }
};
