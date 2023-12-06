import { FileType } from "@/types/common";

interface useFilePickerOptions {
  accept: FileType[];
  multiple?: boolean;
}

/**
 * React friendly hook to initiate a file picker without having an input element in the page.
 * @param onChange
 * @param options
 * @returns openPickerHandler
 */
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
