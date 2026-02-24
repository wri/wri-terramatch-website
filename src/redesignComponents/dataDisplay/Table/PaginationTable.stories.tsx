import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Table from "./Table";

const meta: Meta<typeof Table> = {
  title: "Redesign Components/Data Display/PaginationTable",
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
    totalItems: {
      control: "number",
      description: "Total number of items (for server-side pagination)"
    },
    showItemCount: {
      control: "boolean",
      description: "Show or hide the item count below the table"
    },
    isScrollable: {
      control: "boolean",
      description: "Enable horizontal/vertical scroll"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Table>;

const generateData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: `Category ${(i % 5) + 1}`,
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Inactive",
    date: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    amount: `$${((i + 1) * 150).toLocaleString()}`
  }));

const defaultColumns = [
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "amount", label: "Amount", sortable: true }
];

export const Default: Story = {
  decorators: [
    Story => (
      <>
        <style>{`table { display: none; }`}</style>
        <Story />
      </>
    )
  ],
  args: {
    data: generateData(25),
    columns: defaultColumns,
    selectable: false,
    showItemCount: true
  }
};

export const LargeDataset: Story = {
  name: "Large Dataset (100 items)",
  args: {
    data: generateData(100),
    columns: defaultColumns,
    selectable: false,
    showItemCount: true
  }
};

export const WithSelection: Story = {
  name: "With Row Selection",
  args: {
    data: generateData(30),
    columns: defaultColumns,
    selectable: true,
    showItemCount: true
  }
};

export const WithoutItemCount: Story = {
  name: "Without Item Count",
  args: {
    data: generateData(25),
    columns: defaultColumns,
    selectable: false,
    showItemCount: false
  }
};

export const ServerSidePagination: Story = {
  name: "Server-side Pagination (totalItems override)",
  args: {
    data: generateData(10),
    columns: defaultColumns,
    totalItems: 500,
    selectable: false,
    showItemCount: true
  }
};

export const SmallDataset: Story = {
  name: "Small Dataset (5 items)",
  args: {
    data: generateData(5),
    columns: defaultColumns,
    selectable: false,
    showItemCount: true
  }
};
