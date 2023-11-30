import { Meta, StoryObj } from "@storybook/react";

import Component from "./ImageWithPlaceholder";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ImageWithPlaceholder",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => {
      return (
        <div className="h-44">
          <Story />
        </div>
      );
    }
  ],
  args: {
    imageUrl: "https://headshots-inc.com/wp-content/uploads/2020/11/Professional-Headshot-Poses-Blog-Post.jpg",
    alt: "Some Alt",
    className: "h-full"
  }
};

export const NoImage: Story = {
  decorators: [
    Story => {
      return (
        <div className="h-44">
          <Story />
        </div>
      );
    }
  ],
  args: {
    alt: "Some Alt",
    className: "h-full"
  }
};
