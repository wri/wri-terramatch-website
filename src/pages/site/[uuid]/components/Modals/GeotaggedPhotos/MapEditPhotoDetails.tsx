import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useEffect } from "react";

import { useMedia } from "@/connections/Media";
import Log from "@/utils/log";

import EditPhotoDetails from "./EditPhotoDetails";

export interface MapEditPhotoDetailsProps {
  uuid: string;
  onClose: () => void;
}

const MapEditPhotoDetails: FC<MapEditPhotoDetailsProps> = ({ uuid, onClose }) => {
  const t = useT();
  const [, { data, loadFailure }] = useMedia({ id: uuid });

  useEffect(() => {
    if (loadFailure == null) return;
    Log.error("Failed to load media details", loadFailure);
    showToast({
      label: t("Failed to load image details"),
      type: "error",
      placement: "bottom",
      duration: 5000,
      maxWidth: "auto"
    });
    onClose();
  }, [loadFailure, onClose, t]);

  return data == null ? null : <EditPhotoDetails open data={data} onClose={onClose} />;
};

export default MapEditPhotoDetails;
