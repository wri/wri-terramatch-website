import type { Meta, StoryObj } from "@storybook/react";

import SliderInput from "./SliderInput";

const meta = {
  title: "Redesign Components/Forms/Input/Slider Input",
  component: SliderInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: any) => (
      <div style={{ width: "26.25rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SliderInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Continuous: Story = {
  args: {
    label: "Continuous",
    caption: "Caption",
    sliderItem: {
      min: 0,
      max: 100,
      value: [30]
    },
    onChange: (value: number[]) => console.log("Continuous", value),
    required: true
  }
};

export const Small: Story = {
  args: {
    label: "Small",
    caption: "Caption",
    size: "small",
    sliderItem: {
      min: 0,
      max: 100,
      value: [60]
    },
    onChange: (value: number[]) => console.log("Small", value),
    required: true
  }
};

export const Discrete: Story = {
  args: {
    label: "Discrete",
    caption: "Caption",
    sliderItem: {
      min: 0,
      max: 100,
      value: [75],
      marks: [
        { value: 0, label: 0 },
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 75, label: 75 },
        { value: 100, label: 100 }
      ],
      step: 25
    },
    onChange: (value: number[]) => console.log("Discrete", value),
    required: true
  }
};

export const Range: Story = {
  args: {
    label: "Range",
    caption: "Caption",
    sliderItem: {
      min: 0,
      max: 100,
      value: [20, 80]
    },
    onChange: (value: number[]) => console.log("Range", value),
    required: true
  }
};

export const Centered: Story = {
  args: {
    label: "Centered",
    caption: "Caption",
    sliderItem: {
      min: -100,
      max: 100,
      value: [0],
      isCentred: true
    },
    onChange: (value: number[]) => console.log("Centered", value),
    required: true
  }
};
