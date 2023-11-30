import { useState } from "react";
import { Confirm, ImageField, ImageInput, ImageInputProps } from "react-admin";

import { useDeleteV2FilesUUID } from "@/generated/apiComponents";
import { FileType, UploadedFile } from "@/types/common";

export const ImageUploadInput = (props: ImageInputProps) => {
  const [removeImage, setRemoveImage] = useState<any>(null);
  const [showModal, setShowModal] = useState<any>(false);

  const { mutate: deleteFile } = useDeleteV2FilesUUID({});

  return (
    <>
      <ImageInput
        {...props}
        accept={FileType.Image}
        maxSize={10 * 1024 * 1024}
        //@ts-ignore
        validateFileRemoval={async (file: UploadedFile) => {
          if (file.uuid) {
            setShowModal(true);
            return new Promise((resolve, reject) => {
              setRemoveImage({
                fileName: file.file_name,
                delete: () => {
                  deleteFile({ pathParams: { uuid: file.uuid } });
                  return resolve(true);
                },
                cancel: () => reject(false)
              });
            });
          } else {
            return Promise.resolve(true);
          }
        }}
      >
        <>
          <ImageField source="url" />
          <ImageField source="src" />
        </>
      </ImageInput>
      <Confirm
        isOpen={showModal}
        title="Delete image!"
        content={`${removeImage ? removeImage.fileName : ""} will be deleted, even if you hit cancel on the form.`}
        onConfirm={() => {
          setShowModal(false);
          removeImage && removeImage.delete();
        }}
        onClose={() => {
          setShowModal(false);
          removeImage && removeImage.cancel();
        }}
      />
    </>
  );
};
