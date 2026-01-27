import { Meta, StoryObj } from "@storybook/react";

import { Edit } from "@/redesignComponents/foundations/Icons";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Redesign Components/Actions/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "borderless", "outline"]
    },
    size: {
      control: "select",
      options: ["default", "small"]
    },
    disabled: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary Variant Stories
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary"
  }
};

export const PrimaryDisabled: Story = {
  args: {
    children: "Primary Disabled",
    variant: "primary",
    disabled: true
  }
};

export const PrimaryWithLeftIcon: Story = {
  render: () => (
    <Button variant="primary" leftIcon={<Edit className="h-4 w-4" />}>
      Primary with Icon
    </Button>
  )
};

export const PrimaryWithRightIcon: Story = {
  render: () => (
    <Button variant="primary" rightIcon={<Edit className="h-4 w-4" />}>
      Primary with Icon
    </Button>
  )
};

export const PrimarySmall: Story = {
  args: {
    children: "Primary Small",
    variant: "primary",
    size: "small"
  }
};

// Secondary Variant Stories
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary"
  }
};

export const SecondaryDisabled: Story = {
  args: {
    children: "Secondary Disabled",
    variant: "secondary",
    disabled: true
  }
};

export const SecondaryWithLeftIcon: Story = {
  render: () => (
    <Button variant="secondary" leftIcon={<Edit className="h-4 w-4" />}>
      Secondary with Icon
    </Button>
  )
};

export const SecondaryWithRightIcon: Story = {
  render: () => (
    <Button variant="secondary" rightIcon={<Edit className="h-4 w-4" />}>
      Secondary with Icon
    </Button>
  )
};

export const SecondarySmall: Story = {
  args: {
    children: "Secondary Small",
    variant: "secondary",
    size: "small"
  }
};

// Borderless Variant Stories
export const Borderless: Story = {
  args: {
    children: "Borderless Button",
    variant: "borderless"
  }
};

export const BorderlessDisabled: Story = {
  args: {
    children: "Borderless Disabled",
    variant: "borderless",
    disabled: true
  }
};

export const BorderlessWithLeftIcon: Story = {
  render: () => (
    <Button variant="borderless" leftIcon={<Edit className="h-4 w-4" />}>
      Borderless with Icon
    </Button>
  )
};

export const BorderlessWithRightIcon: Story = {
  render: () => (
    <Button variant="borderless" rightIcon={<Edit className="h-4 w-4" />}>
      Borderless with Icon
    </Button>
  )
};

export const BorderlessSmall: Story = {
  args: {
    children: "Borderless Small",
    variant: "borderless",
    size: "small"
  }
};

// Outline Variant Stories
export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline"
  }
};

export const OutlineDisabled: Story = {
  args: {
    children: "Outline Disabled",
    variant: "outline",
    disabled: true
  }
};

export const OutlineWithLeftIcon: Story = {
  render: () => (
    <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
      Outline with Icon
    </Button>
  )
};

export const OutlineWithRightIcon: Story = {
  render: () => (
    <Button variant="outline" rightIcon={<Edit className="h-4 w-4" />}>
      Outline with Icon
    </Button>
  )
};

export const OutlineSmall: Story = {
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
};

// Loading States
export const PrimaryLoading: Story = {
  args: {
    children: "Loading Button",
    variant: "primary",
    loading: true
  }
};

export const SecondaryLoading: Story = {
  args: {
    children: "Loading Button",
    variant: "secondary",
    loading: true
  }
};

// Combination Examples
export const SmallWithIcon: Story = {
  render: () => (
    <Button variant="primary" size="small" leftIcon={<Edit className="h-4 w-4" />}>
      Small with Icon
    </Button>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="borderless">Borderless</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary" size="default">
        Default Size
      </Button>
      <Button variant="primary" size="small">
        Small Size
      </Button>
    </div>
  )
};
