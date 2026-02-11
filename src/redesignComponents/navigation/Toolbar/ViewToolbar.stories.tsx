import { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "@/redesignComponents/foundations/Icons";

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
      <div style={{ backgroundColor: "#F5F5F5", padding: "20px", borderRadius: "8px" }}>
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
  { label: "Overview", value: "overview", icon: <Placeholder boxSize={4} /> },
  { label: "Details", value: "details", icon: <Placeholder boxSize={4} /> },
  { label: "Settings", value: "settings", icon: <Placeholder boxSize={4} /> }
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
