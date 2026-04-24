import Log from "@/utils/log";

/**
 * Downloads a file from remote url using fileName
 * @param url File Url to download
 * @param fileName File Name to download
 */
export const downloadFileUrl = (url: string, fileName?: string) => {
  try {
    const link = document.createElement("a");
    link.href = url;
    if (fileName != null) link.download = fileName;
    link.click();
  } catch (err) {
    Log.error("Failed to download file", url, err);
  }
};

/**
 * Force Downloads a blob
 * @param blob File contents to download
 * @param fileName File name to assign to download.
 */
export const downloadFileBlob = async (blob: Blob, fileName: string) => {
  try {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    link.click();
  } catch (err) {
    Log.error("Failed to download blob", fileName, err);
  }
};
