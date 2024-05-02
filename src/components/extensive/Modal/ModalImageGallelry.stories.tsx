import { Meta, StoryObj } from "@storybook/react";

import { dataImageGallery } from "./ModalContent/MockedData";
import { ModalImageGalleryProps as Props } from "./ModalImageGallery";
import Component from "./ModalImageGallery";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Modal/ModalImageGallery",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <div className="flex items-center justify-center bg-primary-400 p-8">
      <Component {...args} />
    </div>
  ),
  args: {
    onCLose: () => {},
    tabItems: dataImageGallery,
    title: ""
  }
};
