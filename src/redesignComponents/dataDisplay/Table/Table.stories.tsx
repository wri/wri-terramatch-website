import { Box, TableCell, TableRow } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "@/redesignComponents/foundations/Icons";

import Table from "./Table";
import { FULL_WIDTH_TABLE_HEADER_STYLES } from "./tableStyles";
import { NO_HEADER_TABLE_WRAPPER_STYLES } from "./tableStyles";
import { type RowData } from "./tableUtils";

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
    },
    renderRow: {
      description: "Custom render function for table rows. Receives rowData and returns React.ReactNode"
    },
    renderDataCell: {
      description: "Custom render function for table cells. Receives rowData and columnKey, returns React.ReactNode"
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
          image: "https://i.pravatar.cc/300?img=4&w=640&q=75"
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
          icon: <Placeholder className="h-5 w-5 text-theme-neutral-800" />
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
      ...generateSampleData(3),
      {
        id: "title-with-link",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label with Link",
          link: "https://example.com",
          primaryText: "Click to visit external link"
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

export const WithLinkTitleRow: Story = {
  args: {
    data: [
      {
        id: "title-with-link-only",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          link: "/",
          primaryText: "With link"
        }
      },
      {
        id: "title-with-link-and-image",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          link: "/",
          image: "https://i.pravatar.cc/300?img=5&w=640&q=75",
          primaryText: "Link with image"
        }
      },
      {
        id: "title-with-link-and-avatar",
        name: "Label",
        email: "Label",
        age: 0,
        title: {
          label: "Label",
          link: "/",
          avatar: {
            name: "John Doe",
            ariaLabel: "John Doe avatar"
          },
          secondaryText: "Link with avatar"
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

const columns = [
  { key: "speciesName", label: "Species Name" },
  { key: "numberOfTreesExpected", label: "Number of Trees Expected" }
];

const data = Array.from({ length: 100 }, (_, index) => ({
  speciesName: `Species Name ${index + 1}`,
  numberOfTreesExpected: "XXXXXX"
}));

export const VariantFullWidth: Story = {
  args: {
    data: data,
    columns: columns,
    totalItems: data.length,
    showItemCount: false,
    variant: "full-width",
    css: FULL_WIDTH_TABLE_HEADER_STYLES
  }
};

const noHeaderColumns = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" }
];

type NoHeaderRowData = {
  id: number;
  [key: number]: string;
};

const noHeaderData: NoHeaderRowData[] = [
  { id: 1, 1: "Pericopsis Elata", 2: "Senna spectabilis", 3: "Senna spectabilis", 4: "Senna spectabilis" },
  { id: 2, 1: "Canarium Schweinfurthii", 2: "Adansenthera pavonina", 3: "Pericopsis Elata", 4: "Senna spectabilis" },
  { id: 3, 1: "Bigihia welkitschii", 2: "Pericopsis Elata", 3: "Canarium Schweinfurthii", 4: "Bigihia welkitschii" },
  {
    id: 4,
    1: "Adansenthera pavonina",
    2: "Canarium Schweinfurthii",
    3: "Canarium Schweinfurthii",
    4: "Bigihia welkitschii"
  },
  { id: 5, 1: "Senna spectabilis", 2: "Bigihia welkitschii", 3: "Bigihia welkitschii", 4: "Bigihia welkitschii" }
];

export const WithNoHeader: Story = {
  args: {
    data: noHeaderData,
    columns: noHeaderColumns,
    totalItems: noHeaderData.length,
    showItemCount: false,
    variant: "full-width",
    css: NO_HEADER_TABLE_WRAPPER_STYLES,
    renderRow: (rowData: RowData) => {
      const row = rowData as NoHeaderRowData;
      return (
        <TableRow>
          <TableCell>
            <Box className="mr-8 border-b border-theme-neutral-300 py-4">{row[1]}</Box>
          </TableCell>
          <TableCell className="px-0! py-4">
            <Box className="mr-8 border-b border-theme-neutral-300 py-4">{row[2]}</Box>
          </TableCell>
          <TableCell className="px-0! py-4">
            <Box className="mr-8 border-b border-theme-neutral-300 py-4">{row[3]}</Box>
          </TableCell>
          <TableCell className="px-0! py-4">
            <Box className="border-b border-theme-neutral-300 py-4">{row[4]}</Box>
          </TableCell>
        </TableRow>
      );
    }
  }
};
