import { Meta, StoryObj } from "@storybook/react";

import { MoreVert } from "@/redesignComponents/foundations/Icons";

import IconButton from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Redesign Components/Actions/Buttons/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// Basic IconButton Stories
export const Default: Story = {
  args: {
    icon: <MoreVert boxSize={4} />
  }
};

export const Disabled: Story = {
  args: {
    icon: <MoreVert boxSize={4} />,
    disabled: true
  }
};

// Different Sizes
export const SmallIcon: Story = {
  args: {
    icon: <MoreVert className="h-[10px] w-[10px]" />
  }
};

export const MediumIcon: Story = {
  args: {
    icon: <MoreVert className="h-[16px] w-[16px]" />
  }
};

export const LargeIcon: Story = {
  args: {
    icon: <MoreVert className="h-[20px] w-[20px]" />
  }
};

// Interactive Example
export const WithClickHandler: Story = {
  args: {
    icon: <MoreVert boxSize={4} />
  }
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<MoreVert className="m-1 !h-[16px] !w-[16px]" />} />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<MoreVert className="m-1 !h-[16px] !w-[16px]" />} disabled />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Disabled</p>
      </div>
    </div>
  )
};
