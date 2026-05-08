import { Meta, StoryObj } from "@storybook/react";

import { MoreVertIcon } from "@/redesignComponents/foundations/Icons";

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
    icon: <MoreVertIcon boxSize={4} />
  }
};

export const Disabled: Story = {
  args: {
    icon: <MoreVertIcon boxSize={4} />,
    disabled: true
  }
};

// Different Sizes
export const SmallIcon: Story = {
  args: {
    icon: <MoreVertIcon className="h-[0.625rem] w-[0.625rem]" />
  }
};

export const MediumIcon: Story = {
  args: {
    icon: <MoreVertIcon className="h-[1rem] w-[1rem]" />
  }
};

export const LargeIcon: Story = {
  args: {
    icon: <MoreVertIcon className="h-[1.25rem] w-[1.25rem]" />
  }
};

// Interactive Example
export const WithClickHandler: Story = {
  args: {
    icon: <MoreVertIcon boxSize={4} />
  }
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<MoreVertIcon className="m-1 !h-[1rem] !w-[1rem]" />} />
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666" }}>Default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<MoreVertIcon className="m-1 !h-[1rem] !w-[1rem]" />} disabled />
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666" }}>Disabled</p>
      </div>
    </div>
  )
};
