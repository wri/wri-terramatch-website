import { Meta, StoryObj } from "@storybook/react";
import { remove } from "lodash";
import { useState } from "react";

import { FileType, UploadedFile } from "@/types/common";

import Component, { FileInputProps as Props } from "./FileInput";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/File",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SingleUpload: Story = {
  render: (args: Props) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);

    return (
      <Component
        {...args}
        onDelete={file =>
          setFiles(state => {
            const tmp = [...state];
            remove(tmp, f => f.uuid === file.uuid);
            return tmp;
          })
        }
        onChange={files =>
          setFiles(f => [
            ...f,
            ...files.map(file => ({
              title: file.name,
              file_name: file.name,
              mime_type: file.type,
              collection_name: "storybook",
              size: file.size,
              url: "https://google.com",
              created_at: "now",
              uuid: file.name
            }))
          ])
        }
        files={files}
      />
    );
  },
  args: {
    label: "Input Label",
    description: "Input description",
    accept: [FileType.Image]
  }
};

export const MultiUpload: Story = {
  args: {
    ...SingleUpload.args,
    allowMultiple: true
  }
};
