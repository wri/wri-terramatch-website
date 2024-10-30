import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Demographic, DemographicsCollapseGridProps } from "@/components/extensive/DemographicsCollapseGrid/types";

import DemographicsCollapseGrid from "./DemographicsCollapseGrid";
import { GRID_VARIANT_DEFAULT, GRID_VARIANT_GREEN, GRID_VARIANT_NARROW } from "./DemographicVariant";

const meta: Meta<typeof DemographicsCollapseGrid> = {
  title: "Components/Extensive/DemographicsCollapse",
  component: DemographicsCollapseGrid
};

type Story = StoryObj<typeof DemographicsCollapseGrid>;

export default meta;

const ControlWrapper = (args: DemographicsCollapseGridProps) => {
  const [demographics, setDemographics] = useState(args.demographics);
  const onChange = (updatedDemographics: Demographic[]) => {
    setDemographics(updatedDemographics);
  };
  return <DemographicsCollapseGrid {...{ ...args, demographics, onChange }} />;
};

export const Default: Story = {
  render: (args: DemographicsCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <DemographicsCollapseGrid {...args} />
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

export const VariantNarrow: Story = {
  render: (args: DemographicsCollapseGridProps) => {
    return (
      <div className="w-1/2 rounded-2xl">
        <DemographicsCollapseGrid {...args} />
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
    variant: GRID_VARIANT_NARROW
  }
};

export const CompleteGreen: Story = {
  render: (args: DemographicsCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <ControlWrapper {...args} />
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
    variant: GRID_VARIANT_GREEN
  }
};

export const NotStartedGreen: Story = {
  render: (args: DemographicsCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <ControlWrapper {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    demographics: [],
    variant: GRID_VARIANT_GREEN
  }
};

export const InProgressGreen: Story = {
  render: (args: DemographicsCollapseGridProps) => {
    return (
      <div className="rounded-2xl">
        <ControlWrapper {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    demographics: [
      { type: "gender", name: "female", amount: 20 },
      { type: "age", name: "adult", amount: 75 }
    ],
    variant: GRID_VARIANT_GREEN
  }
};
