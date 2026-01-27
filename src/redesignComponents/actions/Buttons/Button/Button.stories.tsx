import { Meta, StoryObj } from "@storybook/react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

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
  args: {
    children: "Primary with Icon",
    variant: "primary",
    leftIcon: <Icon name={IconNames.PLUS} width={16} />
  }
};

export const PrimaryWithRightIcon: Story = {
  args: {
    children: "Primary with Icon",
    variant: "primary",
    rightIcon: <Icon name={IconNames.PLUS} width={16} />
  }
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
  args: {
    children: "Secondary with Icon",
    variant: "secondary",
    leftIcon: <Icon name={IconNames.PLUS} width={16} />
  }
};

export const SecondaryWithRightIcon: Story = {
  args: {
    children: "Secondary with Icon",
    variant: "secondary",
    rightIcon: <Icon name={IconNames.PLUS} width={16} />
  }
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
  args: {
    children: "Borderless with Icon",
    variant: "borderless",
    leftIcon: <Icon name={IconNames.PLUS} width={16} />
  }
};

export const BorderlessWithRightIcon: Story = {
  args: {
    children: "Borderless with Icon",
    variant: "borderless",
    rightIcon: <Icon name={IconNames.PLUS} width={16} />
  }
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
  args: {
    children: "Outline with Icon",
    variant: "outline",
    leftIcon: <Icon name={IconNames.PLUS} width={16} />
  }
};

export const OutlineWithRightIcon: Story = {
  args: {
    children: "Outline with Icon",
    variant: "outline",
    rightIcon: <Icon name={IconNames.PLUS} width={16} />
  }
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
  args: {
    children: "Small with Icon",
    variant: "primary",
    size: "small",
    leftIcon: <Icon name={IconNames.PLUS} width={14} />
  }
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
