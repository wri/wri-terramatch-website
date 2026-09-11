import { useCallback, useState } from "react";

import type { DuplicatePolygonUploadInfo } from "../utils/polygonUploadDuplicate";

export const useExistingPolygonModal = () => {
  const [openExistingPolygonModal, setOpenExistingPolygonModal] = useState(false);
  const [existingPolygonDuplicate, setExistingPolygonDuplicate] = useState<DuplicatePolygonUploadInfo | null>(null);

  const onDuplicateDetected = useCallback((duplicate: DuplicatePolygonUploadInfo) => {
    setExistingPolygonDuplicate(duplicate);
    setOpenExistingPolygonModal(true);
  }, []);

  const onExistingPolygonModalOpenChange = useCallback((open: boolean) => {
    setOpenExistingPolygonModal(open);
    if (!open) {
      setExistingPolygonDuplicate(null);
    }
  }, []);

  return {
    openExistingPolygonModal,
    existingPolygonDuplicate,
    onDuplicateDetected,
    onExistingPolygonModalOpenChange
  };
};
