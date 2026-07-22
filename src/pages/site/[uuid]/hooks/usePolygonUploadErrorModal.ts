import { useCallback, useState } from "react";

export const usePolygonUploadErrorModal = () => {
  const [openUploadErrorModal, setOpenUploadErrorModal] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  const onUploadError = useCallback((message: string) => {
    setUploadErrorMessage(message);
    setOpenUploadErrorModal(true);
  }, []);

  const onUploadErrorModalOpenChange = useCallback((open: boolean) => {
    setOpenUploadErrorModal(open);
    if (!open) {
      setUploadErrorMessage(null);
    }
  }, []);

  return {
    openUploadErrorModal,
    uploadErrorMessage,
    onUploadError,
    onUploadErrorModalOpenChange
  };
};
