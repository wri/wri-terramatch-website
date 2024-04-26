import { Meta, StoryObj } from "@storybook/react";

import WorkdayCollapseGrid, { WorkdayCollapseGridProps } from "./WorkdayCollapseGrid";

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
    ]
  }
};

export const Complete: Story = {
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
    ]
  }
};

export const NotStarted: Story = {
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
    ]
  }
};

export const InProgress: Story = {
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
    ]
  }
};
