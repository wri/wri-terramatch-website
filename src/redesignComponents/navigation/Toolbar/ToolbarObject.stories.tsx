import { Meta, StoryObj } from "@storybook/react";
import { Fragment } from "react";
import { BrowserRouter, Link } from "react-router-dom";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import { ToolbarSlot } from "./ToolBar.type";
import ToolbarObject from "./ToolbarObject";

const meta: Meta<typeof ToolbarObject> = {
  title: "Redesign Components/Navigation/Toolbar/Object Toolbar",
  component: ToolbarObject,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <div style={{ backgroundColor: "#F5F5F5", padding: "1.25rem", borderRadius: "0.5rem" }}>
          <Story />
        </div>
      </BrowserRouter>
    )
  ],
  argTypes: {
    breadcrumbs: {
      description: "Breadcrumb configuration with links and navigation"
    }
  }
};

const renderSuffix = (slots: ToolbarSlot[]) => {
  return slots.map((slot, index) => (
    <Fragment key={`${slot.title}-${index}`}>
      <div className="border-theme-neutral-700 bg-theme-neutral-200 flex flex-col rounded border border-dashed p-1">
        <p className="text-10-bold text-theme-neutral-800 leading-[normal]">{slot.title}</p>
        <p className="text-10 text-theme-neutral-700 leading-[normal]">{slot.description}</p>
      </div>
      {index < slots.length - 1 && <div className="bg-theme-neutral-300 h-3.5 w-[0.0625rem]" />}
    </Fragment>
  ));
};

export default meta;
type Story = StoryObj<typeof ToolbarObject>;

export const Default: Story = {
  args: {
    breadcrumbs: {
      links: [
        { label: "Page level 1", link: "#", icon: <PlaceholderIcon /> },
        { label: "Page level 2", link: "#" },
        { label: "Page level 3", link: "#" }
      ],
      linkRouter: Link
    },
    suffix: renderSuffix([
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" }
    ])
  }
};

export const MultipleSlots: Story = {
  args: {
    breadcrumbs: {
      links: [
        { label: "Page level 1", link: "#", icon: <PlaceholderIcon /> },
        { label: "Page level 2", link: "#" }
      ],
      linkRouter: Link
    },
    suffix: renderSuffix([
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" },
      { title: "Slot three", description: "Add button or input" },
      { title: "Slot four", description: "Add button or input" }
    ])
  }
};

export const WithBreadcrumbIcons: Story = {
  args: {
    breadcrumbs: {
      links: [
        { label: "Page level 1", link: "#", icon: <PlaceholderIcon /> },
        { label: "Page level 2", link: "#" },
        { label: "Page level 3", link: "#" }
      ],
      linkRouter: Link
    },
    suffix: renderSuffix([
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" }
    ])
  }
};

export const PageTitle: Story = {
  args: {
    breadcrumbs: {
      links: [{ label: "Title", link: "#", icon: <PlaceholderIcon /> }],
      linkRouter: Link
    },
    suffix: renderSuffix([
      { title: "Slot one", description: "Add button or input" },
      { title: "Slot two", description: "Add button or input" },
      { title: "Slot three", description: "Add button or input" },
      { title: "Slot four", description: "Add button or input" }
    ])
  }
};
