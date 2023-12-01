import { Meta, StoryObj } from "@storybook/react";

import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";

import { IconNames } from "../Icon/Icon";
import Confirmation from "./Confirmation";

const meta: Meta<typeof Confirmation> = {
  title: "Components/Extensive/Confirmation",
  component: Confirmation
};

export default meta;
type Story = StoryObj<typeof Confirmation>;

export const Default: Story = {
  //@ts-ignore
  render: args => {
    return (
      <BackgroundLayout>
        <ContentLayout>
          <Confirmation {...args} />
        </ContentLayout>
      </BackgroundLayout>
    );
  },
  args: {
    icon: IconNames.EARTH,
    title: "Request success!"
  }
};
