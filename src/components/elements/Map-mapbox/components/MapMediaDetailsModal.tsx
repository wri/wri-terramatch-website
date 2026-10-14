import { useT } from "@transifex/react";
import { FC, useEffect } from "react";

import ModalImageDetails, { ModalImageDetailProps } from "@/components/extensive/Modal/ModalImageDetails";
import Loader from "@/components/generic/Loading/Loader";
import { useMedia } from "@/connections/Media";
import { useNotificationContext } from "@/context/notification.provider";
import Log from "@/utils/log";

type MapMediaDetailsModalProps = Omit<ModalImageDetailProps, "data"> & { uuid: string };

const MapMediaDetailsModal: FC<MapMediaDetailsModalProps> = ({ uuid, ...props }) => {
  const t = useT();
  const { openNotification } = useNotificationContext();
  const [, { data, loadFailure }] = useMedia({ id: uuid });
  const { onClose } = props;

  useEffect(() => {
    if (loadFailure == null) return;
    Log.error("Failed to load media details", loadFailure);
    openNotification("error", t("Error"), t("Failed to load image details"));
    onClose?.();
  }, [loadFailure, onClose, openNotification, t]);

  return data == null ? <Loader /> : <ModalImageDetails {...props} data={data} />;
};

export default MapMediaDetailsModal;
