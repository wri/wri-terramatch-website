import { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter, Link } from "react-router-dom";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import ToolbarObject from "./ToolbarObject";

const meta: Meta<typeof ToolbarObject> = {
  title: "Redesign Components/Navigation/Toolbar/Toolbar Object",
  component: ToolbarObject,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <div style={{ backgroundColor: "#F5F5F5", padding: "20px", borderRadius: "8px" }}>
          <Story />
        </div>
      </BrowserRouter>
    )
  ],
  argTypes: {
    breadcrumbs: {
      description: "Breadcrumb configuration with links and navigation"
    },
    slots: {
      description: "Array of toolbar slots with title and description"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToolbarObject>;

/**
 * Default ToolbarObject with breadcrumbs and slots
 */
export const Default: Story = {
  args: {
    breadcrumbs: {
      links: [
        { label: "Home", link: "#", icon: <PlaceholderIcon /> },
        { label: "Projects", link: "#" },
        { label: "Project Details", link: "#" }
      ],
      linkRouter: Link
    },
    slots: [
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" }
    ]
  }
};

/**
 * ToolbarObject with multiple slots
 */
export const MultipleSlots: Story = {
  args: {
    breadcrumbs: {
      links: [
        { label: "Dashboard", link: "#", icon: <PlaceholderIcon /> },
        { label: "Settings", link: "#" },
        { label: "User", link: "#" }
      ],
      linkRouter: Link
    },
    slots: [
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" },
      { title: "Slot three", description: "Add button or input" },
      { title: "Slot four", description: "Add button or input" }
    ]
  }
};

/**
 * ToolbarObject with breadcrumb icons
 */
export const WithBreadcrumbIcons: Story = {
  args: {
    breadcrumbs: {
      links: [
        { label: "Home", link: "#", icon: <PlaceholderIcon /> },
        { label: "Documents", link: "#" },
        { label: "Document", link: "#" }
      ],
      linkRouter: Link
    },
    slots: [
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" }
    ]
  }
};
