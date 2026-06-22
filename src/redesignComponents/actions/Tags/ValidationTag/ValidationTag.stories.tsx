import { Meta, StoryObj } from "@storybook/react";

import ValidationTag from "./ValidationTag";

const meta: Meta<typeof ValidationTag> = {
  title: "Redesign Components/Actions/Tags/Validation Tag",
  component: ValidationTag,
  args: {
    className: "",
    size: "default"
  },
  argTypes: {
    status: {
      control: "select",
      options: ["not-started", "partially-passed", "failed", "passed"]
    },
    size: {
      control: "inline-radio",
      options: ["default", "small"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof ValidationTag>;

export const NotStarted: Story = {
  args: {
    status: "not-started"
  }
};

export const PartiallyPassed: Story = {
  args: {
    status: "partially-passed"
  }
};

export const Failed: Story = {
  args: {
    status: "failed"
  }
};

export const Passed: Story = {
  args: {
    status: "passed"
  }
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ValidationTag className="" status="not-started" />
      <ValidationTag className="" status="partially-passed" />
      <ValidationTag className="" status="failed" />
      <ValidationTag className="" status="passed" />
    </div>
  )
};

export const SizeVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <ValidationTag className="" status="passed" size="default" />
        <ValidationTag className="" status="passed" size="small" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <ValidationTag className="" status="not-started" size="default" />
        <ValidationTag className="" status="not-started" size="small" />
      </div>
    </div>
  )
};

export const WithExtraClassName: Story = {
  args: {
    status: "passed",
    className: "ring-2 ring-theme-neutral-400"
  }
};
