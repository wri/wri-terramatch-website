import { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import ViewToolbar from "./ViewToolbar";

const meta: Meta<typeof ViewToolbar> = {
  title: "Redesign Components/Navigation/Toolbar/View Toolbar",
  component: ViewToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    Story => (
      <div style={{ backgroundColor: "#F5F5F5", padding: "1.25rem", borderRadius: "0.5rem" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    tabBar: {
      description: "TabBar configuration with tabs, variant, and callbacks"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ViewToolbar>;

const defaultTabs = [
  { label: "Overview", value: "overview", icon: <PlaceholderIcon boxSize={4} /> },
  { label: "Details", value: "details", icon: <PlaceholderIcon boxSize={4} /> },
  { label: "Settings", value: "settings", icon: <PlaceholderIcon boxSize={4} /> }
];

export const Default: Story = {
  args: {
    tabBar: {
      tabs: defaultTabs,
      defaultValue: "overview",
      onTabClick: (tabValue: string) => console.log("Tab clicked:", tabValue)
    }
  }
};
