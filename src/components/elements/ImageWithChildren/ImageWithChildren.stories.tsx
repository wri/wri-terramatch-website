import { Meta, StoryObj } from "@storybook/react";
import TreesHeaderImage from "public/images/trees-header.webp";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";

import Component, { ImageWithChildrenProps as Props } from "./ImageWithChildren";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ImageWithChildren",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  render: (args: Props) => <Component {...args} />,
  args: {
    imageSrc: TreesHeaderImage,
    className: "h-[203px] w-full",
    children: (
      <div className="m-auto flex h-full w-full max-w-7xl flex-col items-start justify-between p-10 text-white">
        <Button
          variant="text"
          iconProps={{ name: IconNames.CHEVRON_LEFT_CIRCLE, width: 32, height: 32 }}
          className="gap-2 p-0"
        >
          Back to somewhere
        </Button>
        <Text as="h1" variant="text-heading-700">
          [Title]
        </Text>
      </div>
    )
  }
};
