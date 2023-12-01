import { Meta, StoryObj } from "@storybook/react";

import ButtonField from "./ButtonField";
import Component from "./FieldsExpander";
import LinkField from "./LinkField";
import TextField from "./TextField";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Fields/FieldsExpander",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: args => (
    <Component {...args}>
      <TextField label="Metric" value="1,321" />
      <LinkField label="News Article" value="Visit" url="https://google.com" external />
      <ButtonField label="2023 Report" buttonProps={{ children: "Download", onClick: () => window.alert("Pressed") }} />
    </Component>
  ),
  args: {
    title: "Key Metrics and Information",
    expanded: true
  }
};
