import { Box, TableCell, TableRow } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import ActionCell from "./components/ActionCell";
import CustomTableCell from "./components/TableCell";
import TitleCell from "./components/TitleCell";
import Table from "./Table";
import { FULL_WIDTH_TABLE_HEADER_STYLES } from "./tableStyles";
import { NO_HEADER_TABLE_WRAPPER_STYLES } from "./tableStyles";
import { type RowData, hasCustomCellContent } from "./tableUtils";

const defaultRenderDataCell = (rowData: RowData, columnKey: string) => {
  if (columnKey === "actions" && rowData.actionCell != null) {
    return <ActionCell button={rowData.actionCell.button} onButtonIconClick={rowData.actionCell.onButtonIconClick} />;
  }

  if (columnKey === "name") {
    if (rowData.title != null) {
      return <TitleCell {...rowData.title} />;
    }

    if (hasCustomCellContent(rowData)) {
      return (
        <CustomTableCell
          avatars={rowData.avatars}
          primaryText={rowData.primaryText}
          secondaryText={rowData.secondaryText}
          progressTag={rowData.progressTag}
          trees={rowData.trees}
          jobs={rowData.jobs}
          multiActionButton={rowData.multiActionButton}
        />
      );
    }

    return rowData.fullName ?? (rowData as any)[columnKey];
  }

  return (rowData as any)[columnKey];
};

const meta: Meta<typeof Table> = {
  title: "Redesign Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  args: {
    renderDataCell: defaultRenderDataCell
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
          icon: <PlaceholderIcon className="text-theme-neutral-800 h-5 w-5" />
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
  { key: "Column 1", label: "Label 1" },
  { key: "Column 2", label: "Label 2" }
];

const data = Array.from({ length: 100 }, (_, index) => ({
  "Column 1": `Label ${index + 1}`,
  "Column 2": `Label ${index + 1}`
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
  { id: 1, 1: "Label 1", 2: "Label 2", 3: "Label 3", 4: "Label 4" },
  { id: 2, 1: "Label 5", 2: "Label 6", 3: "Label 7", 4: "Label 8" },
  { id: 3, 1: "Label 9", 2: "Label 10", 3: "Label 11", 4: "Label 12" },
  {
    id: 4,
    1: "Label 13",
    2: "Label 14",
    3: "Label 15",
    4: "Label 16"
  },
  { id: 5, 1: "Label 5", 2: "Label 6", 3: "Label 7", 4: "Label 8" },
  { id: 6, 1: "Label 9", 2: "Label 10", 3: "Label 11", 4: "Label 12" },
  { id: 7, 1: "Label 13", 2: "Label 14", 3: "Label 15", 4: "Label 16" },
  { id: 8, 1: "Label 17", 2: "Label 18", 3: "Label 19", 4: "Label 20" },
  { id: 9, 1: "Label 21", 2: "Label 22", 3: "Label 23", 4: "Label 24" },
  { id: 10, 1: "Label 25", 2: "Label 26", 3: "Label 27", 4: "Label 28" }
];

export const WithNoHeader: Story = {
  args: {
    data: noHeaderData,
    columns: noHeaderColumns,
    totalItems: noHeaderData.length,
    showItemCount: false,
    variant: "full-width",
    css: NO_HEADER_TABLE_WRAPPER_STYLES,
    pageSize: 4,
    renderRow: (rowData: RowData) => {
      const row = rowData as NoHeaderRowData;
      return (
        <TableRow>
          <TableCell>
            <Box className="border-theme-neutral-300 mr-8 border-b py-4">{row[1]}</Box>
          </TableCell>
          <TableCell className="px-0! py-4">
            <Box className="border-theme-neutral-300 mr-8 border-b py-4">{row[2]}</Box>
          </TableCell>
          <TableCell className="px-0! py-4">
            <Box className="border-theme-neutral-300 mr-8 border-b py-4">{row[3]}</Box>
          </TableCell>
          <TableCell className="px-0! py-4">
            <Box className="border-theme-neutral-300 border-b py-4">{row[4]}</Box>
          </TableCell>
        </TableRow>
      );
    }
  }
};
