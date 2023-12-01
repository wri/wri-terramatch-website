import { FileType } from "@/types/common";

interface useFilePickerOptions {
  accept: FileType[];
  multiple?: boolean;
}

export const useFilePicker = (onChange: (files: FileList) => void, options?: useFilePickerOptions) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = options?.accept.join(",") || "";
  input.multiple = options?.multiple || false;

  input.onchange = e =>
    //@ts-ignore
    onChange(e.target.files);

  return {
    open: () => input.click()
  };
};
