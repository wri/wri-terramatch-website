import { closeToast } from "@worldresources/wri-design-systems";

import { showToast } from "@/redesignComponents/status/Toast/showToast";

const DEFAULT_TOAST_ID = "downloadToast";
const DEFAULT_PLACEMENT = "bottom" as const;
const DEFAULT_DURATION_MS = 5000;
/** Progress toasts must persist until the download finishes; design system defaults to 5s when omitted. */
const PROGRESS_DURATION_MS = Number.POSITIVE_INFINITY;

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
    duration: PROGRESS_DURATION_MS
  });
};

// Reuses the progress toast id so the progress toast turns into the success toast, as the polygon downloads do.
const showDownloadCompleteToast = (id: string, label: string) => {
  showToast({
    id,
    label,
    type: "success",
    placement: DEFAULT_PLACEMENT,
    duration: DEFAULT_DURATION_MS
  });
};

const showDownloadErrorToast = (label: string) => {
  showToast({
    label,
    type: "error",
    placement: DEFAULT_PLACEMENT,
    duration: DEFAULT_DURATION_MS
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
    showDownloadCompleteToast(toastId, messages.complete);
  } catch (error) {
    closeToast(toastId);
    if (messages.error) {
      showDownloadErrorToast(messages.error);
    }
    throw error;
  }
};
