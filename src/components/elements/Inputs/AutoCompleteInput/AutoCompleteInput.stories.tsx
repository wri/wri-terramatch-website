import { Meta, StoryObj } from "@storybook/react";

import Component from "./AutoCompleteInput";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/AutoComplete",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    type: "text",
    label: "Input Label",
    placeholder: "Input placeholder",
    description: "Input description",
    onSearch(query: string) {
      return Promise.resolve(["item1", "item2", "item3", "item4", "item5"]);
    }
  }
};
