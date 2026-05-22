import { Meta, StoryObj } from "@storybook/react";

import { ProfileImage as Component } from "./ProfileImage";

const meta: Meta<typeof Component> = {
  title: "Redesign Components/Content/Images/Profile Image",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=4",
    alt: "John Doe",
    size: 41
  }
};

export const Small: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=4",
    alt: "John Doe",
    size: 24
  }
};

export const Large: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=4",
    alt: "John Doe",
    size: 96
  }
};

export const NotAvailable: Story = {
  args: {
    isAdd: true,
    size: 41
  }
};
