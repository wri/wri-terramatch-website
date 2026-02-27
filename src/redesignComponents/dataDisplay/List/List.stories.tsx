import type { Meta, StoryObj } from "@storybook/react";

import { TreeCircleIcon } from "../../foundations/Icons";
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

export const VariantData: Story = {
  args: {
    items: baseItems.map(item => ({ ...item, variant: "data" as const, value: "XXX,XXX" }))
  }
};

export const VariantNavigation: Story = {
  args: {
    items: [
      { id: "1", label: "Label", icon: <TreeCircleIcon className="h-6 w-6" />, variant: "navigation" as const },
      { id: "2", label: "Label", icon: <TreeCircleIcon className="h-6 w-6" />, variant: "navigation" as const },
      { id: "3", label: "Label", icon: <TreeCircleIcon className="h-6 w-6" />, variant: "navigation" as const },
      { id: "4", label: "Label", icon: <TreeCircleIcon className="h-6 w-6" />, variant: "navigation" as const },
      { id: "5", label: "Label", icon: <TreeCircleIcon className="h-6 w-6" />, variant: "navigation" as const },
      { id: "6", label: "Label", icon: <TreeCircleIcon className="h-6 w-6" />, variant: "navigation" as const }
    ]
  }
};

export const VariantSelect: Story = {
  args: {
    items: baseItems.map(item => ({ ...item, variant: "select" as const }))
  }
};

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

export const HighlightedIndex: Story = {
  args: {
    highlightedIndex: 1,
    items: baseItems.map(item => ({ ...item, variant: "select" as const }))
  }
};

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

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: "1",
        label: "Label",
        caption: "Caption",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        variant: "data" as const
      },
      {
        id: "2",
        label: "Label",
        caption: "Caption",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        variant: "data" as const
      },
      {
        id: "3",
        label: "Label",
        caption: "Caption",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        variant: "data" as const
      },
      {
        id: "4",
        label: "Label",
        caption: "Caption",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        variant: "data" as const
      }
    ]
  }
};

export const WithValue: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", variant: "data" as const, value: "XXX,XXX" },
      { id: "2", label: "Label", caption: "Caption", variant: "data" as const, value: "XXX,XXX" },
      { id: "3", label: "Label", caption: "Caption", variant: "data" as const, value: "XXX,XXX" },
      { id: "4", label: "Label", caption: "Caption", variant: "data" as const, value: "XXX,XXX" }
    ]
  }
};

export const WithOnItemClick: Story = {
  args: {
    items: [
      {
        id: "1",
        label: "Label",
        caption: "Caption",
        variant: "navigation" as const,
        ariaLabel: "Item 1",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 1")
      },
      {
        id: "2",
        label: "Label",
        caption: "Caption",
        variant: "navigation" as const,
        ariaLabel: "Item 2",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 2")
      },
      {
        id: "3",
        label: "Label",
        caption: "Caption",
        variant: "navigation" as const,
        ariaLabel: "Item 3",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 3")
      }
    ]
  }
};

export const WithExpandedItem: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption", variant: "navigation" as const, isExpanded: false },
      { id: "2", label: "Label", caption: "Caption", variant: "navigation" as const, isExpanded: true },
      { id: "3", label: "Label", caption: "Caption", variant: "navigation" as const, isExpanded: false }
    ]
  }
};
