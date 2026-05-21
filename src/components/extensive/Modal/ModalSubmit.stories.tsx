import { Meta, StoryObj } from "@storybook/react";

import { TranslatedText } from "@/i18n/types";

import { ModalSubmitProps as Props } from "./ModalSubmit";
import Component from "./ModalSubmit";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Modal/ModalSubmit",
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
    title: "Submit Polygons" as TranslatedText,
    content: "Project Developers may submit one or all polygons for review." as TranslatedText,
    primaryButtonText: "Next" as TranslatedText,
    primaryButtonProps: {
      className: "px-8 py-3",
      variant: "primary",
      onClick: () => {}
    },
    secondaryButtonText: "Cancel" as TranslatedText,
    secondaryButtonProps: { className: "px-8 py-3", variant: "white-page-admin", onClick: () => {} },
    site: { uuid: "" }
  }
};
