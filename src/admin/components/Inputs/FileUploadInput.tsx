import { styled } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { Confirm, FileField, FileInput, ImageField, ImageInputProps } from "react-admin";

import { useDeleteV2FilesUUID } from "@/generated/apiComponents";
import { UploadedFile } from "@/types/common";

export const FileUploadInput: FC<ImageInputProps> = ({ accept, ...props }) => {
  const [removeFile, setRemoveFile] = useState<any>(null);
  const [showModal, setShowModal] = useState<any>(false);

  const { mutate: deleteFile } = useDeleteV2FilesUUID({});

  accept = useMemo(() => (Array.isArray(accept) ? accept.join(",") : accept), [accept]);
  return (
    <>
      <StyledFileUpload
        {...props}
        accept={accept}
        validateFileRemoval={async (file: UploadedFile) => {
          if (file.uuid) {
            setShowModal(true);
            return new Promise((resolve, reject) => {
              setRemoveFile({
                fileName: file.fileName,
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
          <FileField source="url" title="fileName" target="_blank" />
          <FileField source="src" title="title" target="_blank" />
          <ImageField source="url" />
          <ImageField source="src" />
        </>
      </StyledFileUpload>

      <Confirm
        isOpen={showModal}
        title="Delete file!"
        content={`${removeFile ? removeFile.fileName : ""} will be deleted, even if you hit cancel on the form.`}
        onConfirm={() => {
          setShowModal(false);
          removeFile && removeFile.delete();
        }}
        onClose={() => {
          setShowModal(false);
          removeFile && removeFile.cancel();
        }}
      />
    </>
  );
};

const StyledFileUpload = styled(FileInput, {
  overridesResolver: (props, styles) => styles.root
})(({ theme }) => ({
  "& > .RaFileInput-dropZone": {
    border: `dashed 1px ${theme.palette.primary.light}`
  }
}));
