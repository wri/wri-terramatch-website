import type { Meta, StoryObj } from "@storybook/react";

import Pagination from "./Pagination";

const meta = {
  title: "Redesign Components/Navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: "number",
      description: "Current active page number (1-indexed)"
    },
    pageSize: {
      control: "number",
      description: "Number of items per page"
    },
    totalItems: {
      control: "number",
      description: "Total number of items to paginate"
    },
    onChange: {
      action: "page changed",
      description: "Callback fired when page changes"
    }
  }
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pagination with 100 items, showing 10 per page
 */
export const Default: Story = {
  args: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 100
  }
};

/**
 * Pagination on the first page
 */
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 50
  }
};

/**
 * Pagination on a middle page
 */
export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    pageSize: 10,
    totalItems: 100
  }
};

/**
 * Pagination on the last page
 */
export const LastPage: Story = {
  args: {
    currentPage: 10,
    pageSize: 10,
    totalItems: 100
  }
};

/**
 * Small dataset with few pages (3 total pages)
 */
export const FewPages: Story = {
  args: {
    currentPage: 2,
    pageSize: 10,
    totalItems: 25
  }
};

/**
 * Large dataset with many pages (50 total pages)
 */
export const ManyPages: Story = {
  args: {
    currentPage: 25,
    pageSize: 20,
    totalItems: 1000
  }
};

/**
 * Single page only (all items fit on one page)
 */
export const SinglePage: Story = {
  args: {
    currentPage: 1,
    pageSize: 50,
    totalItems: 30
  }
};

/**
 * Large page size (50 items per page)
 */
export const LargePageSize: Story = {
  args: {
    currentPage: 1,
    pageSize: 50,
    totalItems: 500
  }
};

/**
 * Small page size (5 items per page)
 */
export const SmallPageSize: Story = {
  args: {
    currentPage: 3,
    pageSize: 5,
    totalItems: 100
  }
};

/**
 * Interactive example with onChange handler
 */
export const WithOnChange: Story = {
  args: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 100,
    onChange: (page: number) => {
      console.log(`Changed to page ${page}`);
    }
  }
};

/**
 * Comparison of different page sizes
 */
export const PageSizeComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "20px" }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Page Size: 5 (20 total pages)</p>
        <Pagination currentPage={5} pageSize={5} totalItems={100} />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Page Size: 10 (10 total pages)</p>
        <Pagination currentPage={5} pageSize={10} totalItems={100} />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Page Size: 25 (4 total pages)</p>
        <Pagination currentPage={2} pageSize={25} totalItems={100} />
      </div>
    </div>
  )
};

/**
 * Edge cases demonstration
 */
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "20px" }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>No items (0 total items)</p>
        <Pagination currentPage={1} pageSize={10} totalItems={0} />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Single item</p>
        <Pagination currentPage={1} pageSize={10} totalItems={1} />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Exactly one page worth (10 items)</p>
        <Pagination currentPage={1} pageSize={10} totalItems={10} />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>One over one page (11 items)</p>
        <Pagination currentPage={1} pageSize={10} totalItems={11} />
      </div>
    </div>
  )
};
