import { Meta, StoryObj } from "@storybook/react";
import { remove } from "lodash";
import { FC, useState } from "react";

import ToastProvider, { useToastContext } from "@/context/toast.provider";
import { FileType, UploadedFile } from "@/types/common";

import Toast from "../../Toast/Toast";
import Component, { FileInputProps as Props } from "./FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD } from "./FileInputVariants";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/File",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const SingleUploadChildren: FC<{ args: Props }> = ({ args }) => {
  const { openToast } = useToastContext();

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handlePrivateChange = (file: Partial<UploadedFile>, isPrivate: boolean) => {
    openToast(`${file.title} has been updated to be ${isPrivate ? "Private" : "Public"}`);
  };

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
            uuid: file.name,
            is_public: true
          }))
        ])
      }
      files={files}
      onPrivateChange={handlePrivateChange}
      showPrivateCheckbox
    />
  );
};

export const SingleUpload: Story = {
  render: (args: Props) => {
    return (
      <ToastProvider>
        <Toast />

        <SingleUploadChildren args={args} />
      </ToastProvider>
    );
  },
  args: {
    label: "Input Label",
    description: "Input description",
    accept: [FileType.Image]
  }
};

export const VariantForModal: Story = {
  render: (args: Props) => {
    return (
      <ToastProvider>
        <Toast />

        <SingleUploadChildren args={args} />
      </ToastProvider>
    );
  },
  args: {
    label: "Input Label",
    description: "Input description",
    descriptionInput: "drag and drop",
    accept: [FileType.Image],
    variant: VARIANT_FILE_INPUT_MODAL_ADD
  }
};

export const MultiUpload: Story = {
  ...SingleUpload,
  args: {
    ...SingleUpload.args,
    allowMultiple: true
  }
};
