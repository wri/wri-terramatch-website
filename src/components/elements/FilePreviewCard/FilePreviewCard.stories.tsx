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
      fileName: "File Name",
      mimeType: "image/png",
      uuid: "aosidjoa8asdoiajodiajso",
      collectionName: "",
      createdAt: "",
      size: 234234,
      isPublic: true
    },
    accessLevel: "public"
  }
};
