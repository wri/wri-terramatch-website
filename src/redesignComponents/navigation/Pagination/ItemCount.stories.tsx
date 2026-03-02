import type { Meta, StoryObj } from "@storybook/react";

import ItemCount from "./ItemCount";

const meta = {
  title: "Redesign Components/Navigation/Pagination/Item Count",
  component: ItemCount,
  tags: ["autodocs"],
  argTypes: {
    pageSize: {
      control: { type: "number", min: 1 },
      description: "Number of items displayed per page"
    },
    currentPage: {
      control: { type: "number", min: 1 },
      description: "The currently active page (1-based)"
    },
    totalItems: {
      control: { type: "number", min: 0 },
      description: "Total number of items across all pages"
    },
    onPageSizeChange: {
      action: "pageSizeChanged",
      description: "Callback fired when the page size changes"
    },
    showItemCountText: {
      control: "boolean",
      description: "Whether to display the item count text (e.g. '1-10 of 100')"
    }
  }
} satisfies Meta<typeof ItemCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pageSize: 10,
    currentPage: 1,
    totalItems: 100
  }
};

export const WithItemCountText: Story = {
  args: {
    pageSize: 10,
    currentPage: 1,
    totalItems: 100,
    showItemCountText: true
  }
};

export const WithoutItemCountText: Story = {
  args: {
    pageSize: 10,
    currentPage: 1,
    totalItems: 100,
    showItemCountText: false
  }
};

export const MiddlePage: Story = {
  args: {
    pageSize: 10,
    currentPage: 5,
    totalItems: 100,
    showItemCountText: true
  }
};

export const LastPage: Story = {
  args: {
    pageSize: 10,
    currentPage: 10,
    totalItems: 100,
    showItemCountText: true
  }
};

export const LargePageSize: Story = {
  args: {
    pageSize: 50,
    currentPage: 1,
    totalItems: 500,
    showItemCountText: true
  }
};

export const SmallDataset: Story = {
  args: {
    pageSize: 10,
    currentPage: 1,
    totalItems: 5,
    showItemCountText: true
  }
};
