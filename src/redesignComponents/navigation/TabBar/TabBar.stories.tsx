import { Meta, StoryObj } from "@storybook/react";

import { DashboardIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import TabBar, { TabBarWriProps } from "./TabBar";

const meta: Meta<typeof TabBar> = {
  title: "Redesign Components/Navigation/TabBar",
  component: TabBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["panel", "view", "transparent"],
      description: "Visual style of the tab bar"
    },
    tabs: {
      description: "Array of tab objects with label and value"
    },
    defaultValue: {
      control: "text",
      description: "Default value of the tab bar"
    },
    onTabClick: {
      action: "tab clicked",
      description: "Callback fired when tab is clicked"
    },
    activationMode: {
      control: "select",
      options: ["automatic", "manual"],
      description: "Activation mode for tabs"
    }
  }
};

export default meta;
type Story = StoryObj<typeof TabBar>;

const defaultTabs = [
  { label: "One", value: "one", icon: <DashboardIcon boxSize={4} /> },
  { label: "Two", value: "two", icon: <DashboardIcon boxSize={4} /> },
  { label: "Three", value: "three", icon: <DashboardIcon boxSize={4} /> }
];

const defaultTabsTransparent = [
  { label: "One", value: "one", icon: <DashboardIcon boxSize={4} /> },
  { label: "Two", value: "two", icon: <DashboardIcon boxSize={4} /> },
  {
    label: (
      <div className="flex items-center gap-2">
        Three <TextBadge variant="primary">20</TextBadge>{" "}
      </div>
    ),
    value: "three",
    icon: <DashboardIcon boxSize={4} />
  }
];

export const Default: Story = {
  args: {
    tabs: defaultTabs,
    variant: "panel"
  }
};

export const PanelVariant: Story = {
  args: {
    tabs: defaultTabs,
    variant: "panel",
    defaultValue: "one"
  }
};

export const ViewVariant: Story = {
  args: {
    tabs: defaultTabs,
    variant: "view",
    defaultValue: "one"
  }
};

export const TransparentVariant: Story = {
  args: {
    tabs: defaultTabsTransparent as TabBarWriProps["tabs"],
    variant: "transparent",
    defaultValue: "one"
  }
};

export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", padding: "1.25rem" }}>
      <div>
        <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.75rem" }}>Panel Variant</p>
        <TabBar tabs={defaultTabs} variant="panel" defaultValue="one" />
      </div>
      <div>
        <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.75rem" }}>View Variant</p>
        <TabBar tabs={defaultTabs} variant="view" defaultValue="one" />
      </div>
      <div>
        <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.75rem" }}>Transparent Variant</p>
        <TabBar tabs={defaultTabs} variant="transparent" defaultValue="one" />
      </div>
    </div>
  )
};
