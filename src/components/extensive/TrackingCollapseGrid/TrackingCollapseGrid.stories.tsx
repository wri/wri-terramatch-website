import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { TrackingCollapseGridProps } from "@/components/extensive/TrackingCollapseGrid/types";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import TrackingCollapseGrid from "./TrackingCollapseGrid";
import { GRID_VARIANT_DEFAULT, GRID_VARIANT_GREEN, GRID_VARIANT_NARROW } from "./TrackingVariant";

const meta: Meta<typeof TrackingCollapseGrid> = {
  title: "Components/Extensive/DemographicsCollapse",
  component: TrackingCollapseGrid
};

type Story = StoryObj<typeof TrackingCollapseGrid>;

export default meta;

const ControlWrapper = (args: TrackingCollapseGridProps) => {
  const [demographics, setDemographics] = useState(args.entries);
  const onChange = (updatedDemographics: TrackingEntryDto[]) => {
    setDemographics(updatedDemographics);
  };
  return <TrackingCollapseGrid {...{ ...args, demographics, onChange }} />;
};

export const Default: Story = {
  render: (args: TrackingCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <TrackingCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    entries: [
      { type: "gender", subtype: "female", amount: 70 },
      { type: "gender", subtype: "male", amount: 30 },
      { type: "gender", subtype: "unknown", amount: 30 },
      { type: "age", subtype: "youth", amount: 30 },
      { type: "age", subtype: "adult", amount: 30 },
      { type: "age", subtype: "elder", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", name: "XYZ", amount: 130 },
      { type: "ethnicity", subtype: "other", name: "German", amount: 30 },
      { type: "ethnicity", subtype: "unknown", amount: 50 }
    ],
    variant: GRID_VARIANT_DEFAULT,
    domain: "demographics",
    type: "workdays"
  }
};

export const VariantNarrow: Story = {
  render: (args: TrackingCollapseGridProps) => {
    return (
      <div className="w-1/2 rounded-2xl">
        <TrackingCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Nursery Operations Volunteer",
    entries: [
      { type: "gender", subtype: "female", amount: 70 },
      { type: "gender", subtype: "male", amount: 30 },
      { type: "gender", subtype: "unknown", amount: 30 },
      { type: "age", subtype: "youth", amount: 30 },
      { type: "age", subtype: "adult", amount: 30 },
      { type: "age", subtype: "elder", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", name: "XYZ", amount: 130 },
      { type: "ethnicity", subtype: "other", name: "English", amount: 30 },
      { type: "ethnicity", subtype: "unknown", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", name: "ABC", amount: 30 }
    ],
    variant: GRID_VARIANT_NARROW,
    domain: "demographics",
    type: "workdays"
  }
};

export const CompleteGreen: Story = {
  render: (args: TrackingCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <ControlWrapper {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    entries: [
      { type: "gender", subtype: "female", amount: 30 },
      { type: "gender", subtype: "male", amount: 30 },
      { type: "gender", subtype: "non-binary", amount: 30 },
      { type: "age", subtype: "youth", amount: 10 },
      { type: "age", subtype: "adult", amount: 40 },
      { type: "age", subtype: "elder", amount: 10 },
      { type: "age", subtype: "unknown", amount: 30 },
      { type: "ethnicity", subtype: "indigenous", amount: 50 },
      { type: "ethnicity", subtype: "other", name: "Indonesian", amount: 25 },
      { type: "ethnicity", subtype: "unknown", amount: 15 }
    ],
    variant: GRID_VARIANT_GREEN,
    domain: "demographics",
    type: "workdays"
  }
};

export const NotStartedGreen: Story = {
  render: (args: TrackingCollapseGridProps) => {
    return (
      <div className=" rounded-2xl">
        <ControlWrapper {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    entries: [],
    variant: GRID_VARIANT_GREEN,
    domain: "demographics",
    type: "workdays"
  }
};

export const InProgressGreen: Story = {
  render: (args: TrackingCollapseGridProps) => {
    return (
      <div className="rounded-2xl">
        <ControlWrapper {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid",
    entries: [
      { type: "gender", subtype: "female", amount: 20 },
      { type: "age", subtype: "adult", amount: 75 }
    ],
    variant: GRID_VARIANT_GREEN,
    domain: "demographics",
    type: "workdays"
  }
};
