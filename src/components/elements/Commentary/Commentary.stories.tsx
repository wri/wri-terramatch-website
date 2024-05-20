import { Meta, StoryObj } from "@storybook/react";

import { comentaryFiles } from "@/components/extensive/Modal/ModalContent/MockedData";

import { ComentaryProps as Props } from "./Commentary";
import Component from "./Commentary";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Commentary",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <div className="flex items-center justify-center p-8">
      <Component {...args} />
    </div>
  ),
  args: {
    name: "Ricardo",
    lastName: "Saavedra",
    date: "Oct 6, 2022 at 1:12 AM",
    comentary: `Don't see the outline. the source code also needs to be updated.re: aligned to one source. we need to make sure whether this is appropriate. consider that we have the organization in sign-up/profile, mask, and work request boards. On Thursday will provide the the source tables requested`,
    files: comentaryFiles,
    status: "Submitted"
  }
};
