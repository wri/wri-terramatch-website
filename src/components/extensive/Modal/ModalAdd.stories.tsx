import { Meta, StoryObj } from "@storybook/react";

import Text from "@/components/elements/Text/Text";

import { ModalProps as Props } from "./Modal";
import Component from "./ModalAdd";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Modal/ModalAdd",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <div className="flex items-center justify-center bg-primary-400 p-8">
      <Component onCLose={() => {}} {...args} />
    </div>
  ),
  args: {
    title: "Add Polygons",
    descriptionInput: "Drag and drop a GeoJSON, Shapefile, or KML for your site Tannous/Brayton Road.",
    descriptionList: (
      <div className="mt-9 flex">
        <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
        <Text variant="text-12-light">50 MB per upload</Text>
      </div>
    ),
    onCLose: () => {},
    content: "Start by adding polygons to your site.",
    primaryButtonText: "Close",
    primaryButtonProps: { className: "px-8 py-3", variant: "primary", onClick: () => {} }
  }
};
