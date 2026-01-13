import { Meta, StoryObj } from "@storybook/react";

import Table from "./Table";

const meta: Meta<typeof Table> = {
  title: "Redesign Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Table>;

import type { ColumnOption } from "./Table";

const columns: ColumnOption[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    align: "left"
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    align: "left"
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    align: "right"
  }
];

// Example columns with cell options
const columnsWithCellOptions: ColumnOption[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    align: "left",
    cellClassName: "font-semibold"
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    align: "left",
    renderCell: value => (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
        {value}
      </a>
    )
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    align: "right",
    cellStyle: { fontWeight: "bold", color: "#059669" }
  }
];

const sampleData = [
  {
    id: 0,
    name: "Item 1",
    email: "email1@example.com",
    age: 84
  },
  {
    id: 1,
    name: "Item 2",
    email: "email2@example.com",
    age: 26
  },
  {
    id: 2,
    name: "Item 3",
    email: "email3@example.com",
    age: 59
  },
  {
    id: 3,
    name: "Item 4",
    email: "email4@example.com",
    age: 39
  },
  {
    id: 4,
    name: "Item 5",
    email: "email5@example.com",
    age: 59
  },
  {
    id: 5,
    name: "Item 6",
    email: "email6@example.com",
    age: 50
  },
  {
    id: 6,
    name: "Item 7",
    email: "email7@example.com",
    age: 43
  },
  {
    id: 7,
    name: "Item 8",
    email: "email8@example.com",
    age: 3
  },
  {
    id: 8,
    name: "Item 9",
    email: "email9@example.com",
    age: 12
  },
  {
    id: 9,
    name: "Item 10",
    email: "email10@example.com",
    age: 9
  }
];

// Default Table Story
export const Default: Story = {
  render: () => <Table columns={columns} data={sampleData} />
};

// Table with Custom Width
export const CustomWidth: Story = {
  render: () => (
    <div
      style={{
        width: "1200px"
      }}
    >
      <Table columns={columns} data={sampleData} />
    </div>
  )
};

// Table in Container
export const InContainer: Story = {
  render: () => (
    <div
      style={{
        padding: "2rem",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>Data Table</h2>
      <Table columns={columns} data={sampleData} />
    </div>
  )
};

// Table with Cell Options
export const WithCellOptions: Story = {
  render: () => <Table columns={columnsWithCellOptions} data={sampleData} />
};

// Table with Custom Cell Rendering
export const WithCustomCellRendering: Story = {
  render: () => {
    const customColumns: ColumnOption[] = [
      {
        key: "name",
        label: "Name",
        sortable: true,
        align: "left",
        renderCell: value => <strong>{value}</strong>
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
        align: "left",
        renderCell: value => <span style={{ color: "#3b82f6", textDecoration: "underline" }}>{value}</span>
      },
      {
        key: "age",
        label: "Age",
        sortable: true,
        align: "right",
        renderCell: value => (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: value > 50 ? "#fef3c7" : "#dbeafe",
              color: value > 50 ? "#92400e" : "#1e40af"
            }}
          >
            {value}
          </span>
        )
      }
    ];

    return <Table columns={customColumns} data={sampleData} />;
  }
};

// All Cell Types Story - Shows all cell types from Figma design
export const AllCellTypes: Story = {
  render: () => {
    const allCellTypesColumns: ColumnOption[] = [
      {
        key: "checkbox",
        label: "Checkbox",
        cellType: "checkbox",
        cellOptions: {
          checked: () => false,
          onCheckChange: checked => {
            console.log("Checkbox changed:", checked);
          }
        }
      },
      {
        key: "checkboxHeader",
        label: "Checkbox Header",
        cellType: "checkbox-header",
        cellOptions: {
          checked: () => false,
          onCheckChange: checked => {
            console.log("Header checkbox changed:", checked);
          }
        }
      },
      {
        key: "buttons",
        label: "Buttons",
        cellType: "buttons",
        cellOptions: {
          buttonLabels: ["Label", "Label"],
          onButtonClick: (buttonIndex, row) => {
            console.log("Button clicked:", buttonIndex, row);
          }
        }
      },
      {
        key: "data",
        label: "Data",
        cellType: "data",
        cellOptions: {
          dataIcon: "tree"
        }
      },
      {
        key: "header",
        label: "Header",
        cellType: "header"
      },
      {
        key: "link",
        label: "Link",
        cellType: "link",
        cellOptions: {
          linkHref: value => `#${value}`,
          truncate: true
        }
      },
      {
        key: "miscellaneous",
        label: "Miscellaneous",
        cellType: "miscellaneous",
        cellOptions: {
          placeholder: "Slot one"
        }
      },
      {
        key: "profile",
        label: "Profile",
        cellType: "profile"
      },
      {
        key: "text",
        label: "Text",
        cellType: "text"
      }
    ];

    const allCellTypesData = [
      {
        id: 1,
        checkbox: "",
        checkboxHeader: "",
        buttons: "",
        data: "XXXXX",
        header: "Label",
        link: "Label should truncate ...",
        miscellaneous: "",
        profile: "Label",
        text: "Label"
      }
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>
          All Table Cell Types (Hover to see states)
        </h2>
        <Table columns={allCellTypesColumns} data={allCellTypesData} />
      </div>
    );
  }
};

// Individual Cell Type Stories
export const CheckboxCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "checkbox",
        label: "Checkbox",
        cellType: "checkbox",
        cellOptions: {
          checked: row => row.checked || false,
          onCheckChange: (checked, row) => {
            row.checked = checked;
          }
        }
      }
    ];

    const data = [{ id: 1, checkbox: "", checked: false }];

    return <Table columns={columns} data={data} />;
  }
};

export const ButtonsCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "buttons",
        label: "Buttons",
        cellType: "buttons",
        cellOptions: {
          buttonLabels: ["Label", "Label"],
          onButtonClick: buttonIndex => {
            console.log("Button clicked:", buttonIndex);
          }
        }
      }
    ];

    const data = [{ id: 1, buttons: "" }];

    return <Table columns={columns} data={data} />;
  }
};

export const DataCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "dataTree",
        label: "Data (Tree)",
        cellType: "data",
        cellOptions: {
          dataIcon: "tree"
        }
      },
      {
        key: "dataProfile",
        label: "Data (Profile)",
        cellType: "data",
        cellOptions: {
          dataIcon: "profile"
        }
      }
    ];

    const data = [
      { id: 1, dataTree: "XXXXX", dataProfile: "XXXXX" },
      { id: 2, dataTree: "XXXXX", dataProfile: "XXXXX" }
    ];

    return <Table columns={columns} data={data} />;
  }
};

export const HeaderCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "header",
        label: "Header",
        cellType: "header"
      }
    ];

    const data = [{ id: 1, header: "Label" }];

    return <Table columns={columns} data={data} />;
  }
};

export const LinkCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "link",
        label: "Link",
        cellType: "link",
        cellOptions: {
          linkHref: value => `#${value}`,
          truncate: true
        }
      }
    ];

    const data = [{ id: 1, link: "Label should truncate ..." }];

    return <Table columns={columns} data={data} />;
  }
};

export const MiscellaneousCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "miscellaneous",
        label: "Miscellaneous",
        cellType: "miscellaneous",
        cellOptions: {
          placeholder: "Slot one"
        }
      }
    ];

    const data = [{ id: 1, miscellaneous: "" }];

    return <Table columns={columns} data={data} />;
  }
};

export const ProfileCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "profile",
        label: "Profile",
        cellType: "profile"
      }
    ];

    const data = [{ id: 1, profile: "Label" }];

    return <Table columns={columns} data={data} />;
  }
};

export const TextCell: Story = {
  render: () => {
    const columns: ColumnOption[] = [
      {
        key: "text",
        label: "Text",
        cellType: "text"
      }
    ];

    const data = [{ id: 1, text: "Label" }];

    return <Table columns={columns} data={data} />;
  }
};
