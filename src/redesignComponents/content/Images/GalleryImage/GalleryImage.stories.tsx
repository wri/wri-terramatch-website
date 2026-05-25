import { Meta, StoryObj } from "@storybook/react";

import Component from "./GalleryImage";

const meta: Meta<typeof Component> = {
  title: "Redesign Components/Content/Images/Gallery Image",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=4",
    alt: "Gallery Image",
    size: 41
  }
};

export const Small: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=4",
    alt: "Gallery Image",
    size: 24
  }
};

export const Large: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=4",
    alt: "Gallery Image",
    size: 96
  }
};

export const Unavailable: Story = {
  args: {
    src: undefined,
    size: 41
  }
};

export const Add: Story = {
  args: {
    isAdd: true,
    size: 41
  }
};

export const Video: Story = {
  args: {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    size: 41,
    type: "video"
  }
};
