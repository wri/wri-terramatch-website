import { Meta, StoryObj } from "@storybook/react";

import { Organisation } from "@/redesignComponents/foundations/Icons";

import Table from "./Table";

const meta: Meta<typeof Table> = {
  title: "Redesign Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  argTypes: {
    data: {
      description: "Array of data objects to display in the table"
    },
    columns: {
      description: "Array of column definitions for the table"
    },
    selectable: {
      control: "boolean",
      description: "Enable row selection with checkboxes"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data generators
const generateSampleData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Label ${index + 1}`,
    email: `Label`,
    age: Math.floor(Math.random() * 50) + 18,
    department: "Label",
    location: "Label",
    status: "Label",
    startDate: "Label",
    budget: "Label",
    teamSize: "Label",
    priority: "Label",
    category: "Label",
    region: "Label",
    manager: "Label",
    completion: "Label"
  }));
};

const defaultColumns = [
  { key: "name", label: "Label", sortable: true },
  { key: "email", label: "Label", sortable: true },
  { key: "age", label: "Label", sortable: true }
];

const defaultData = generateSampleData(25);

export const Selectable: Story = {
  args: {
    data: defaultData,
    columns: defaultColumns,
    selectable: true
  }
};

export const NonSelectable: Story = {
  args: {
    data: defaultData,
    columns: defaultColumns,
    selectable: false
  }
};

export const WithTitleRows: Story = {
  args: {
    data: [
      {
        id: "title-only-label",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label"
        }
      },
      ...generateSampleData(3),
      {
        id: "title-with-image",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          image: "/images/about-us-1.png"
        }
      },
      ...generateSampleData(3),
      {
        id: "title-with-icon",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          icon: <Organisation className="h-6 w-6 text-theme-neutral-800" />
        }
      },
      ...generateSampleData(3),
      {
        id: "title-with-avatar",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          avatar: {
            name: "Nathan Smith",
            ariaLabel: "Avatar label"
          }
        }
      },
      ...generateSampleData(3),
      {
        id: "title-with-texts",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          primaryText: "Label",
          secondaryText: "Label"
        }
      },
      ...generateSampleData(3)
    ],
    columns: defaultColumns,
    selectable: false
  }
};

export const WithAvatarTitleRow: Story = {
  args: {
    data: [
      {
        id: "title-with-avatar-only",
        title: {
          label: "Label",
          avatar: {
            name: "Nathan Smith",
            ariaLabel: "Avatar label"
          }
        }
      },
      ...generateSampleData(5)
    ],
    columns: defaultColumns,
    selectable: false
  }
};

export const WithTextTitleRow: Story = {
  args: {
    data: [
      {
        id: "title-with-texts-only",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          primaryText: "Label",
          secondaryText: "Label"
        }
      },
      ...generateSampleData(5)
    ],
    columns: defaultColumns,
    selectable: false
  }
};

export const WithCustomCells: Story = {
  args: {
    data: [
      {
        id: "cell-default-label",
        name: "Label",
        email: "label@example.com",
        age: 30
      },
      {
        id: "cell-avatars-and-text",
        name: "",
        email: "label@example.com",
        age: 30,
        avatars: [
          { name: "User One", ariaLabel: "User One" },
          { name: "User Two", ariaLabel: "User Two" },
          { name: "User Three", ariaLabel: "User Three" }
        ]
      },
      {
        id: "cell-only-avatars",
        name: "Label",
        email: "label@example.com",
        age: 30,
        avatars: [{ name: "User Three", ariaLabel: "User Three" }]
      },
      {
        id: "cell-only-progress-tag",
        name: "",
        email: "label@example.com",
        age: 30,
        progressTag: {
          state: "in-progress"
        }
      },
      {
        id: "cell-only-multi-action-button",
        name: "Label",
        email: "label@example.com",
        age: 30,
        multiActionButton: {
          variant: "secondary",
          size: "small",
          mainActionLabel: "Label",
          mainActionOnClick: () => {},
          otherActions: [
            { label: "Option 1", value: "1", onClick: () => {} },
            { label: "Option 2", value: "2", onClick: () => {} }
          ]
        }
      },
      {
        id: "cell-trees-and-jobs",
        name: "",
        email: "label@example.com",
        age: 30,
        trees: "1,200",
        jobs: "350"
      }
    ],
    columns: defaultColumns,
    selectable: false
  }
};

export const WithActionCells: Story = {
  args: {
    data: [
      {
        id: 1,
        name: "Label",
        email: "Label",
        age: 25,
        actionCell: {
          button: {
            children: "View Details",
            onClick: () => {
              console.log("View Details clicked for Project Alpha");
            }
          },
          onButtonIconClick: () => {
            console.log("More options clicked for Project Alpha");
          }
        }
      },
      {
        id: 2,
        name: "Label",
        email: "Label",
        age: 30,
        actionCell: {
          button: {
            children: "Edit",
            variant: "secondary",
            onClick: () => {
              console.log("Edit clicked for Project Beta");
            }
          },
          onButtonIconClick: () => {
            console.log("More options clicked for Project Beta");
          }
        }
      },
      {
        id: 3,
        name: "Label",
        email: "Label",
        age: 35,
        actionCell: {
          button: {
            children: "Delete",
            variant: "outline",
            onClick: () => {
              console.log("Delete clicked for Project Gamma");
            }
          },
          onButtonIconClick: () => {
            console.log("More options clicked for Project Gamma");
          }
        }
      }
    ],
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "age", label: "Age", sortable: true },
      { key: "actions", label: "", sortable: false }
    ],
    selectable: false
  }
};

const manyData = generateSampleData(100);
export const WithManyColumns: Story = {
  args: {
    data: manyData,
    isScrollable: true,
    scrollableWidth: "800px",
    scrollableHeight: "500px",
    columns: [
      { key: "name", label: "Label", sortable: true },
      { key: "email", label: "Label", sortable: true },
      { key: "age", label: "Label", sortable: true },
      { key: "department", label: "Label", sortable: true },
      { key: "location", label: "Label", sortable: true },
      { key: "status", label: "Label", sortable: true },
      { key: "startDate", label: "Label", sortable: true },
      { key: "budget", label: "Label", sortable: true },
      { key: "teamSize", label: "Label", sortable: true },
      { key: "priority", label: "Label", sortable: true },
      { key: "category", label: "Label", sortable: true },
      { key: "region", label: "Label", sortable: true },
      { key: "manager", label: "Label", sortable: true },
      { key: "completion", label: "Label", sortable: true }
    ],
    selectable: false
  }
};
