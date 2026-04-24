import { Map as MapboxMap } from "mapbox-gl";
import React, { MutableRefObject, useEffect } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { deleteMedia, downloadImage, updateMedia } from "@/connections/Media";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";

import { addMediaSourceAndLayer } from "../layers/mediaLayers";

type UseMapMediaParams = {
  map: MutableRefObject<MapboxMap | null>;
  mediaFiles?: MediaDto[];
  styleReady: boolean;
  styleVersion: number;
  entityData?: any;
  t: (key: string) => string;
  showLoader: () => void;
  hideLoader: () => void;
  openNotification: (type: "success" | "error" | "warning", title: string, message?: any) => void;
  openModal: (id: string, content: React.ReactNode, overlay?: boolean) => void;
  closeModal: (id: string) => void;
  setShouldRefetchMediaData: (v: boolean) => void;
  router: { isReady: boolean; asPath: string };
};

export function useMapMedia({
  map,
  mediaFiles,
  styleReady,
  styleVersion,
  entityData,
  t,
  showLoader,
  hideLoader,
  openNotification,
  openModal,
  closeModal,
  setShouldRefetchMediaData,
  router
}: UseMapMediaParams) {
  useEffect(() => {
    if (map.current == null || !styleReady || mediaFiles == null) return;

    const isProjectPath = router.isReady && router.asPath.includes("project");

    const handleDelete = async (id: string) => {
      try {
        await deleteMedia(id);
        closeModal(ModalId.DELETE_IMAGE);
      } catch (error) {
        Log.error(error);
        openNotification("error", t("Error"), t("Failed to delete image."));
      }
    };

    const openModalImageDetail = (data: MediaDto) => {
      openModal(
        ModalId.MODAL_IMAGE_DETAIL,
        <ModalImageDetails
          title="IMAGE DETAILS"
          data={data}
          entityData={entityData}
          onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)}
          reloadGalleryImages={() => setShouldRefetchMediaData(true)}
          handleDelete={handleDelete}
        />,
        true
      );
    };

    const setImageCover = async (uuid: string) => {
      const result = await updateMedia({ isCover: true, profileImageScale: 0, profileImagePosition: {} }, { id: uuid });
      if (result) {
        openNotification("success", t("Success!"), t("Image set as cover successfully"));
        setShouldRefetchMediaData(true);
      } else {
        openNotification("error", t("Error!"), t("Failed to set image as cover"));
      }
    };

    const handleDownload = async (uuid: string, file_name: string): Promise<void> => {
      showLoader();
      try {
        const { fileName, blob } = await downloadImage(uuid);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file_name ?? fileName ?? "image.jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        openNotification("success", t("Success!"), t("Image downloaded successfully"));
      } catch (error) {
        Log.error("Download error:", error);
      } finally {
        hideLoader();
      }
    };

    addMediaSourceAndLayer(
      map.current,
      mediaFiles,
      setImageCover,
      handleDownload,
      handleDelete,
      openModalImageDetail,
      isProjectPath
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaFiles, styleReady, styleVersion]);
}
