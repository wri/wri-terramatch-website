import { Meta, StoryObj } from "@storybook/react";

import { WorkdayCollapseGridProps } from "@/components/extensive/WorkdayCollapseGrid/types";

import WorkdayCollapseGrid from "./WorkdayCollapseGrid";
import { GRID_VARIANT_DEFAULT, GRID_VARIANT_GREEN, GRID_VARIANT_GREY } from "./WorkdayVariant";

const meta: Meta<typeof WorkdayCollapseGrid> = {
  title: "Components/Extensive/WorkdayCollapse",
  component: WorkdayCollapseGrid
};

type Story = StoryObj<typeof WorkdayCollapseGrid>;

export default meta;

export const Default: Story = {
  render: (args: WorkdayCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <WorkdayCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    demographics: [
      { type: "gender", name: "female", amount: 70 },
      { type: "gender", name: "male", amount: 30 },
      { type: "gender", name: "unknown", amount: 30 },
      { type: "age", name: "youth", amount: 30 },
      { type: "age", name: "adult", amount: 30 },
      { type: "age", name: "elder", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", name: "XYZ", amount: 130 },
      { type: "ethnicity", subtype: "other", name: "German", amount: 30 },
      { type: "ethnicity", subtype: "unknown", amount: 50 }
    ],
    variant: GRID_VARIANT_DEFAULT
  }
};

export const VariantGrey: Story = {
  render: (args: WorkdayCollapseGridProps) => {
    return (
      <div className="w-1/2 rounded-2xl">
        <WorkdayCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Nursery Operations Volunteer",
    demographics: [
      { type: "gender", name: "female", amount: 70 },
      { type: "gender", name: "male", amount: 30 },
      { type: "gender", name: "unknown", amount: 30 },
      { type: "age", name: "youth", amount: 30 },
      { type: "age", name: "adult", amount: 30 },
      { type: "age", name: "elder", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", name: "XYZ", amount: 130 },
      { type: "ethnicity", subtype: "other", name: "English", amount: 30 },
      { type: "ethnicity", subtype: "unknown", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", name: "ABC", amount: 30 }
    ],
    variant: GRID_VARIANT_GREY
  }
};

export const CompleteGreen: Story = {
  render: (args: WorkdayCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <WorkdayCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    demographics: [
      { type: "gender", name: "female", amount: 30 },
      { type: "gender", name: "male", amount: 30 },
      { type: "gender", name: "non-binary", amount: 30 },
      { type: "age", name: "youth", amount: 10 },
      { type: "age", name: "adult", amount: 40 },
      { type: "age", name: "elder", amount: 10 },
      { type: "age", name: "unknown", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", amount: 50 },
      { type: "ethnicity", subtype: "other", name: "Indonesian", amount: 25 },
      { type: "ethnicity", subtype: "unknown", amount: 15 }
    ],
    variant: GRID_VARIANT_GREEN,
    onChange: () => {}
  }
};

export const NotStartedGreen: Story = {
  render: (args: WorkdayCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <WorkdayCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    demographics: [],
    variant: GRID_VARIANT_GREEN,
    onChange: () => {}
  }
};

export const InProgressGreen: Story = {
  render: (args: WorkdayCollapseGridProps) => {
    return (
      <div className="rounded-2xl">
        <WorkdayCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    demographics: [
      { type: "gender", name: "female", amount: 20 },
      { type: "age", name: "adult", amount: 75 }
    ],
    variant: GRID_VARIANT_GREEN,
    onChange: () => {}
  }
};
