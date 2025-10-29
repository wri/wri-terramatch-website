import { useCallback, useState } from "react";

import { UploadedFile } from "@/types/common";

export const useFiles = (allowMultiple: boolean, initialValue: UploadedFile[] = []) => {
  const [files, setFiles] = useState<UploadedFile[]>(initialValue);

  const addFile = useCallback(
    (file: Partial<UploadedFile>) => {
      setFiles(value => {
        if (Array.isArray(value) && allowMultiple) {
          const tmp = [...value];
          const index = tmp.findIndex(
            item =>
              (file.uuid != null && file.uuid === item.uuid) || (file.rawFile != null && file.rawFile === item.rawFile)
          );

          if (index === -1) {
            return [...tmp, file as UploadedFile];
          } else {
            tmp.splice(index, 1, file as UploadedFile);
            return tmp;
          }
        } else {
          return [file as UploadedFile];
        }
      });
    },
    [allowMultiple]
  );

  const removeFile = useCallback((file: Partial<UploadedFile>) => {
    setFiles(value => {
      if (Array.isArray(value)) {
        if (file.uuid != null) {
          return value.filter(v => v.uuid !== file.uuid);
        } else {
          return value.filter(v => v.fileName !== file.fileName);
        }
      } else {
        return [];
      }
    });
  }, []);

  const updateFile = useCallback((updatedFile: Partial<UploadedFile>) => {
    setFiles(prevFiles => prevFiles.map(file => (file.uuid === updatedFile.uuid ? { ...file, ...updatedFile } : file)));
  }, []);

  return { files, addFile, removeFile, updateFile };
};
