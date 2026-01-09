import { Meta, StoryObj } from "@storybook/react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import IconButton from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Redesign Components/Forms/Actions/IconButton",
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
    icon: <Icon name={IconNames.PLUS} width={20} />
  }
};

export const Disabled: Story = {
  args: {
    icon: <Icon name={IconNames.PLUS} width={20} />,
    disabled: true
  }
};

// Different Sizes
export const SmallIcon: Story = {
  args: {
    icon: <Icon name={IconNames.PLUS} width={16} />
  }
};

export const MediumIcon: Story = {
  args: {
    icon: <Icon name={IconNames.PLUS} width={20} />
  }
};

export const LargeIcon: Story = {
  args: {
    icon: <Icon name={IconNames.PLUS} width={24} />
  }
};

// Interactive Example
export const WithClickHandler: Story = {
  args: {
    icon: <Icon name={IconNames.PLUS} width={20} />
  }
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<Icon name={IconNames.PLUS} width={20} />} />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<Icon name={IconNames.PLUS} width={20} />} disabled />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Disabled</p>
      </div>
    </div>
  )
};

// Different Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<Icon name={IconNames.PLUS} width={16} />} />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Small (16px)</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<Icon name={IconNames.PLUS} width={20} />} />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Medium (20px)</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconButton icon={<Icon name={IconNames.PLUS} width={24} />} />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Large (24px)</p>
      </div>
    </div>
  )
};
