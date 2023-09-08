import { Meta, StoryObj } from "@storybook/react";

import Component from "./FilePreviewCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/FilePreview",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    file: {
      url: "https://s3-eu-west-1.amazonaws.com/wri-restoration-marketplace-api-test/8V/Ds/8VDszG5DDB6flK1mYgtKqtWySlhXVCjpWEdnpfbOd0WmbgpRYyoWQtFjlre31Ojl.jpg",
      file_name: "File Name",
      mime_type: "image/png",
      uuid: "aosidjoa8asdoiajodiajso",
      collection_name: "",
      created_at: "",
      size: 234234,
      title: "file title"
    },
    accessLevel: "public"
  }
};
