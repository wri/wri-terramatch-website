import type { Meta, StoryObj } from "@storybook/react";

import FloatingActionToolbar from "./FloatingActionToolbar";

const defaultItems = [
  { label: "Delete", onClick: () => {}, labelColor: "error.500" },
  { label: "Download", onClick: () => {} },
  { label: "Submit", onClick: () => {} }
];

const meta = {
  title: "Redesign Components/Navigation/Toolbar/Floating Action Toolbar",
  component: FloatingActionToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    Story => (
      <div style={{ backgroundColor: "#F5F5F5", padding: "1.25rem", borderRadius: "0.5rem" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    items: {
      description: "Toolbar actions with label, onClick, and optional labelColor"
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes for the toolbar container"
    }
  }
} satisfies Meta<typeof FloatingActionToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: defaultItems
  }
};

export const TwoActions: Story = {
  args: {
    items: [
      { label: "Cancel", onClick: () => {} },
      { label: "Save", onClick: () => {} }
    ]
  }
};

export const WithBackground: Story = {
  args: {
    items: defaultItems,
    className: "bg-theme-neutral-200"
  }
};

export const VariantComparison: Story = {
  args: {
    items: defaultItems
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center" }}>
      <FloatingActionToolbar
        items={[
          { label: "Cancel", onClick: () => {} },
          { label: "Save", onClick: () => {} }
        ]}
      />
      <FloatingActionToolbar items={defaultItems} />
      <FloatingActionToolbar items={defaultItems} className="bg-theme-neutral-200" />
    </div>
  )
};
