import type { Meta, StoryObj } from "@storybook/react";

import Pagination from "./Pagination";

const meta = {
  title: "Redesign Components/Navigation/Pagination/Page Turner",
  component: Pagination,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "The currently active page (1-based)"
    },
    totalItems: {
      control: { type: "number", min: 0 },
      description: "Total number of items across all pages"
    },
    pageSize: {
      control: { type: "number", min: 1 },
      description: "Number of items per page"
    },
    variant: {
      control: "select",
      options: ["default", "compact", "compact-with-buttons"],
      description: "Visual variant of the pagination component"
    },
    onPageChange: {
      action: "pageChanged",
      description: "Callback fired when a page is selected"
    }
  }
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    pageSize: 10
  }
};

export const Compact: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    pageSize: 10,
    variant: "compact"
  }
};

export const CompactWithButtons: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    pageSize: 10,
    variant: "compact-with-buttons"
  }
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalItems: 100,
    pageSize: 10
  }
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalItems: 100,
    pageSize: 10
  }
};

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalItems: 15,
    pageSize: 10
  }
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalItems: 5,
    pageSize: 10
  }
};

export const LargeDataset: Story = {
  args: {
    currentPage: 1,
    totalItems: 1000,
    pageSize: 25
  }
};
