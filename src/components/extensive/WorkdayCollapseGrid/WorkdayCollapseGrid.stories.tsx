import { Meta, StoryObj } from "@storybook/react";

import WorkdayCollapseGrid, { WorkdayCollapseGridProps } from "./WorkdayCollapseGrid";
import { GRID_VARIANT_DEFAULT, GRID_VARIANT_GREEN } from "./WorkdayVariant";

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
    title: "A. Site Establishment Paid - 130 Days",
    content: [
      {
        type: "Gender",
        item: [
          {
            title: "Women",
            value: "70 Days"
          },
          {
            title: "Men",
            value: "30 Days"
          },
          {
            title: "Undefined",
            value: "30 Days"
          }
        ],
        total: "130 Days"
      },
      {
        type: "Age",
        item: [
          {
            title: "Youth",
            value: "30 Days"
          },
          {
            title: "Adult",
            value: "30 Days"
          },
          {
            title: "Elder",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Ethnicity",
        item: [
          {
            title: "Indigenous XYZ",
            value: "130 Days"
          },
          {
            title: "Other",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      }
    ],
    variant: GRID_VARIANT_DEFAULT,
    nameSelect: "Ethnicity ABC",
    daySelect: "120 Days"
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
    title: "A. Site Establishment Paid - 130 Days",
    status: "Complete",
    content: [
      {
        type: "Gender",
        item: [
          {
            title: "Women",
            value: "30 Days"
          },
          {
            title: "Men",
            value: "30 Days"
          },
          {
            title: "Undefined",
            value: "30 Days"
          },
          {
            title: "Decline to Specify",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Age",
        item: [
          {
            title: "Youth (15-24)",
            value: "30 Days"
          },
          {
            title: "Adult (24-65)",
            value: "30 Days"
          },
          {
            title: "Elder (65+)",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Ethnicity",
        item: [
          {
            title: "Indigenous",
            value: "130 Days"
          },
          {
            title: "Other",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      }
    ],
    variant: GRID_VARIANT_GREEN
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
    title: "A. Site Establishment Paid - 130 Days",
    status: "Not Started",
    content: [
      {
        type: "Gender",
        item: [
          {
            title: "Women",
            value: "30 Days"
          },
          {
            title: "Men",
            value: "30 Days"
          },
          {
            title: "Undefined",
            value: "30 Days"
          },
          {
            title: "Decline to Specify",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Age",
        item: [
          {
            title: "Youth (15-24)",
            value: "30 Days"
          },
          {
            title: "Adult (24-65)",
            value: "30 Days"
          },
          {
            title: "Elder (65+)",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Ethnicity",
        item: [
          {
            title: "Indigenous",
            value: "130 Days"
          },
          {
            title: "Other",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      }
    ],
    variant: GRID_VARIANT_GREEN
  }
};

export const InProgressgGreen: Story = {
  render: (args: WorkdayCollapseGridProps) => {
    return (
      <div className="rounded-2xl">
        <WorkdayCollapseGrid {...args} />
      </div>
    );
  },
  args: {
    title: "A. Site Establishment Paid - 130 Days",
    status: "In Progress",
    content: [
      {
        type: "Gender",
        item: [
          {
            title: "Women",
            value: "30 Days"
          },
          {
            title: "Men",
            value: "30 Days"
          },
          {
            title: "Undefined",
            value: "30 Days"
          },
          {
            title: "Decline to Specify",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Age",
        item: [
          {
            title: "Youth (15-24)",
            value: "30 Days"
          },
          {
            title: "Adult (24-65)",
            value: "30 Days"
          },
          {
            title: "Elder (65+)",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      },
      {
        type: "Ethnicity",
        item: [
          {
            title: "Indigenous",
            value: "130 Days"
          },
          {
            title: "Other",
            value: "30 Days"
          },
          {
            title: "Unknown",
            value: "30 Days"
          }
        ],
        total: "100 Days"
      }
    ],
    variant: GRID_VARIANT_GREEN
  }
};
