import { closeToast, showToast } from "@worldresources/wri-design-systems";

const DEFAULT_TOAST_ID = "downloadToast";
const DEFAULT_PLACEMENT = "bottom" as const;

export const DOWNLOAD_COMPLETE_MESSAGE = "Download complete";
export const DOWNLOAD_ERROR_MESSAGE = "Something went wrong!";

export type DownloadToastMessages = {
  downloading: string;
  complete: string;
  error?: string;
};

const showDownloadingToast = (id: string, label: string) => {
  showToast({
    id,
    label,
    type: "loading",
    placement: DEFAULT_PLACEMENT,
    maxWidth: "auto"
  });
};

const showDownloadCompleteToast = (label: string) => {
  showToast({
    label,
    type: "success",
    placement: DEFAULT_PLACEMENT,
    duration: 5000,
    maxWidth: "auto"
  });
};

const showDownloadErrorToast = (label: string) => {
  showToast({
    label,
    type: "error",
    placement: DEFAULT_PLACEMENT,
    duration: 5000,
    maxWidth: "auto"
  });
};

export const runWithDownloadToast = async (
  messages: DownloadToastMessages,
  action: () => void | Promise<void>,
  toastId = DEFAULT_TOAST_ID
) => {
  showDownloadingToast(toastId, messages.downloading);

  try {
    await action();
    closeToast(toastId);
    showDownloadCompleteToast(messages.complete);
  } catch (error) {
    closeToast(toastId);
    if (messages.error) {
      showDownloadErrorToast(messages.error);
    }
    throw error;
  }
};
