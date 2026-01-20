import { Meta, StoryObj } from "@storybook/react";

import Table from "./Table";

const meta: Meta<typeof Table> = {
  title: "Redesign Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    selectable: {
      control: "boolean",
      description: "Enable row selection with checkboxes",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" }
      }
    },
    stickyHeader: {
      control: "boolean",
      description: "Make table header sticky on scroll",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" }
      }
    }
  },
  args: {
    selectable: false,
    stickyHeader: false
  }
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
  args: {
    columns,
    data: sampleData
  }
};

// Table with Custom Width
export const CustomWidth: Story = {
  render: () => (
    <div>
      <Table columns={columns} data={sampleData} />
    </div>
  )
};

// All Cell Types Story - Shows all cell types from Figma design
export const AllCellTypes: Story = {
  render: () => {
    const allCellTypesColumns: ColumnOption[] = [
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
        key: "link",
        label: "Link",
        cellType: "link",
        cellOptions: {
          linkHref: value => `#${value}`,
          truncate: true,
          widthLinkCell: "!max-w-10 !w-10"
        }
      },
      {
        key: "miscellaneous",
        label: "Miscellaneous",
        cellType: "miscellaneous",
        cellOptions: {
          title: "Slot one",
          description: "Add button or input"
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
        buttons: "",
        data: "XXXXX",
        header: "Label",
        link: "Lorem ipsum dolor sit amet consectetur adipiscing elit purus, rutrum odio penatibus tempor dapibus fermentum in, ultricies proin blandit lectus convallis suscipit maecenas. Auctor felis vehicula parturient condimentum posuere nostra, mollis sociis ullamcorper lacinia mattis, litora curabitur metus hac mi. Aliquam mauris semper magna nec arcu ac himenaeos ut sociis, urna iaculis dictum laoreet fusce cum commodo eros, vitae condimentum facilisi convallis class pharetra nunc nisl.",
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

// Table with Selectable Rows (using native selectable prop)
export const WithSelectable: Story = {
  render: () => {
    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>Table with Selectable Rows</h2>
        <Table columns={columns} data={sampleData} selectable={true} />
      </div>
    );
  }
};

// Table with Sticky Header
export const WithStickyHeader: Story = {
  render: () => {
    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>
          Table with Sticky Header (Scroll to see effect)
        </h2>
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          <Table
            columns={columns}
            data={sampleData}
            stickyHeader={true}
            pagination={{
              currentPage: 1,
              pageSize: 10,
              totalItems: sampleData.length,
              showPagination: true
            }}
          />
        </div>
      </div>
    );
  }
};

// Individual Cell Type Stories
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
          dataIcon: "jobs"
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

    const data = [
      {
        id: 1,
        link: "Lorem ipsum dolor sit amet consectetur adipiscing elit purus, rutrum odio penatibus tempor dapibus fermentum in, ultricies proin blandit lectus convallis suscipit maecenas. Auctor felis vehicula parturient condimentum posuere nostra, mollis sociis ullamcorper lacinia mattis, litora curabitur metus hac mi. Aliquam mauris semper magna nec arcu ac himenaeos ut sociis, urna iaculis dictum laoreet fusce cum commodo eros, vitae condimentum facilisi convallis class pharetra nunc nisl."
      }
    ];

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
          title: "Slot one",
          description: "Add button or input"
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
      },
      {
        key: "profileImage",
        label: "Profile Image",
        cellType: "profile",
        cellOptions: {
          profileImage: value => "https://i.pravatar.cc/300?img=4"
        }
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
