import type { Meta, StoryObj } from "@storybook/react";

import { Dashboard, Edit, Info, Landscape, Nursery, Project, Reports, Site } from "../../foundations/Icons";
import List from "./List";

const meta: Meta<typeof List> = {
  title: "Redesign Components/Data Display/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#FFFFFF" },
        { name: "gray", value: "#F5F5F5" }
      ]
    }
  },
  argTypes: {
    noBorder: {
      control: "boolean",
      description: "Removes the border wrapper from the list"
    },
    highlightedIndex: {
      control: "number",
      description: "Zero-based index of the item to highlight"
    },
    items: {
      description:
        "Array of ListItemProps — each item supports: label, caption, icon, value, variant, disabled, isExpanded, isHighlighted, onItemClick, ariaLabel"
    }
  }
};

export default meta;
type Story = StoryObj<typeof List>;

const baseItems = [
  { id: "1", label: "Label", caption: "Caption" },
  { id: "2", label: "Label", caption: "Caption" },
  { id: "3", label: "Label", caption: "Caption" },
  { id: "4", label: "Label", caption: "Caption" }
];

// ─── variant ─────────────────────────────────────────────────────────────────

export const VariantData: Story = {
  args: {
    items: baseItems.map(item => ({ ...item, variant: "data" as const, value: "Value" }))
  }
};

export const VariantNavigation: Story = {
  args: {
    items: [
      { id: "1", label: "Label", icon: <Dashboard className="h-5 w-5" />, variant: "navigation" as const },
      { id: "2", label: "Label", icon: <Project className="h-5 w-5" />, variant: "navigation" as const },
      { id: "3", label: "Label", icon: <Landscape className="h-5 w-5" />, variant: "navigation" as const },
      { id: "4", label: "Label", icon: <Nursery className="h-5 w-5" />, variant: "navigation" as const },
      { id: "5", label: "Label", icon: <Reports className="h-5 w-5" />, variant: "navigation" as const },
      { id: "6", label: "Label", icon: <Site className="h-5 w-5" />, variant: "navigation" as const }
    ]
  }
};

export const VariantSelect: Story = {
  args: {
    items: baseItems.map(item => ({ ...item, variant: "select" as const }))
  }
};

// ─── noBorder ────────────────────────────────────────────────────────────────

export const WithBorder: Story = {
  args: {
    noBorder: false,
    items: baseItems.map(item => ({ ...item, variant: "data" as const }))
  }
};

export const NoBorder: Story = {
  args: {
    noBorder: true,
    items: baseItems.map(item => ({ ...item, variant: "data" as const }))
  }
};

// ─── highlightedIndex ────────────────────────────────────────────────────────

export const HighlightedIndex: Story = {
  args: {
    highlightedIndex: 1,
    items: baseItems.map(item => ({ ...item, variant: "select" as const }))
  }
};

// ─── isHighlighted (per-item) ────────────────────────────────────────────────

export const ItemIsHighlighted: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", variant: "data" as const, isHighlighted: false },
      { id: "2", label: "Label", caption: "Caption", variant: "data" as const, isHighlighted: true },
      { id: "3", label: "Label", caption: "Caption", variant: "data" as const, isHighlighted: false },
      { id: "4", label: "Label", caption: "Caption", variant: "data" as const, isHighlighted: false }
    ]
  }
};

// ─── disabled ────────────────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", variant: "select" as const, disabled: false },
      { id: "2", label: "Label", caption: "Caption", variant: "select" as const, disabled: true },
      { id: "3", label: "Label", caption: "Caption", variant: "select" as const, disabled: false },
      { id: "4", label: "Label", caption: "Caption", variant: "select" as const, disabled: true }
    ]
  }
};

// ─── icon ─────────────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", icon: <Project className="h-5 w-5" />, variant: "data" as const },
      { id: "2", label: "Label", caption: "Caption", icon: <Edit className="h-5 w-5" />, variant: "data" as const },
      { id: "3", label: "Label", caption: "Caption", icon: <Info className="h-5 w-5" />, variant: "data" as const },
      { id: "4", label: "Label", caption: "Caption", icon: <Dashboard className="h-5 w-5" />, variant: "data" as const }
    ]
  }
};

// ─── value ────────────────────────────────────────────────────────────────────

export const WithValue: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", variant: "data" as const, value: "Value" },
      { id: "2", label: "Label", caption: "Caption", variant: "data" as const, value: "Value" },
      { id: "3", label: "Label", caption: "Caption", variant: "data" as const, value: "Value" },
      { id: "4", label: "Label", caption: "Caption", variant: "data" as const, value: "Value" }
    ]
  }
};

// ─── onItemClick ──────────────────────────────────────────────────────────────

export const WithOnItemClick: Story = {
  args: {
    items: [
      {
        id: "1",
        label: "Label",
        caption: "Caption",
        variant: "navigation" as const,
        ariaLabel: "Item 1",
        onItemClick: () => console.log("Clicked item 1")
      },
      {
        id: "2",
        label: "Label",
        caption: "Caption",
        variant: "navigation" as const,
        ariaLabel: "Item 2",
        onItemClick: () => console.log("Clicked item 2")
      },
      {
        id: "3",
        label: "Label",
        caption: "Caption",
        variant: "navigation" as const,
        ariaLabel: "Item 3",
        onItemClick: () => console.log("Clicked item 3")
      }
    ]
  }
};

// ─── isExpanded ───────────────────────────────────────────────────────────────

export const WithExpandedItem: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", variant: "navigation" as const, isExpanded: false },
      { id: "2", label: "Label", caption: "Caption", variant: "navigation" as const, isExpanded: true },
      { id: "3", label: "Label", caption: "Caption", variant: "navigation" as const, isExpanded: false }
    ]
  }
};
