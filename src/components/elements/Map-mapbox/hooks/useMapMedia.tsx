import { useT } from "@transifex/react";
import { Map as MapboxMap } from "mapbox-gl";
import React, { MutableRefObject, useEffect, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { deleteMedia, updateMedia } from "@/connections/Media";
import { openEditPhotoDetailsFromMapPopup } from "@/context/mapArea.utils";
import { exportImage } from "@/generated/v3/entityService/entityServiceComponents";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import { TranslatedText } from "@/i18n/types";
import { runWithDownloadToast } from "@/utils/downloadToast";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";

import { useChampionsMap } from "../championsMap.context";
import MapMediaDetailsModal from "../components/MapMediaDetailsModal";
import { addMediaMarkers, removeMediaMarkers } from "../layers/mediaMarkers";
import { removeMediaSymbolLayer, upsertMediaSymbolLayer } from "../layers/mediaSymbolLayer";
import { MapMedia, MediaCallbacks } from "../layers/mediaTypes";
import { useGeotaggedPhotosVisibility } from "./useGeotaggedPhotosVisibility";

type UseMapMediaParams = {
  map: MutableRefObject<MapboxMap | null>;
  mediaFiles?: MapMedia[];
  styleReady: boolean;
  styleVersion: number;
  entityData?: any;
  t: typeof useT;
  showLoader: () => void;
  hideLoader: () => void;
  openNotification: (type: "success" | "error" | "warning", title: TranslatedText, message?: any) => void;
  openModal: (id: string, content: React.ReactNode, overlay?: boolean) => void;
  closeModal: (id: string) => void;
  setShouldRefetchMediaData: (v: boolean) => void;
  router: { isReady: boolean; asPath: string };
  alwaysShowPhotosOnMap?: boolean;
  hideMediaPopupActions?: boolean;
  hideMediaOnMap?: boolean;
  isPolygonGeometryLoading?: boolean;
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
  router,
  alwaysShowPhotosOnMap = false,
  hideMediaPopupActions = false,
  hideMediaOnMap = false,
  isPolygonGeometryLoading = false
}: UseMapMediaParams) {
  const championsMap = useChampionsMap();
  const downloadToastMessages = useDownloadToastMessages();
  const photosVisible = useGeotaggedPhotosVisibility({
    alwaysShowPhotosOnMap,
    hideMediaOnMap,
    isPolygonGeometryLoading
  });
  const [callbacks, setCallbacks] = useState<MediaCallbacks | null>(null);

  useEffect(() => {
    const isProjectPath = router.isReady && router.asPath.includes("project");

    const handleDelete = async (id: string) => {
      try {
        await runWithDownloadToast(
          {
            downloading: t("Deleting Geotagged Photo"),
            complete: t("Photo Deleted"),
            error: t("Failed to delete photo.")
          },
          async () => {
            await deleteMedia(id);
            trackPolygonEvent("polygon_image_edited", {
              ...getPolygonAnalyticsContext({
                entityType: entityData?.entityName ?? entityData?.entityType ?? "site",
                entityId: entityData?.entityUUID ?? entityData?.uuid
              }),
              polygon_id: "unknown"
            });
            closeModal(ModalId.DELETE_IMAGE);
            setShouldRefetchMediaData(true);
          },
          `media-delete-${id}`
        );
      } catch (error) {
        Log.error(error);
      }
    };

    const openModalImageDetail = (uuid: string) => {
      if (championsMap) {
        openEditPhotoDetailsFromMapPopup(uuid);
        return;
      }

      openModal(
        ModalId.MODAL_IMAGE_DETAIL,
        <MapMediaDetailsModal
          title="IMAGE DETAILS"
          uuid={uuid}
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
        trackPolygonEvent("polygon_image_edited", {
          ...getPolygonAnalyticsContext({
            entityType: entityData?.entityName ?? entityData?.entityType ?? "site",
            entityId: entityData?.entityUUID ?? entityData?.uuid
          }),
          polygon_id: "unknown"
        });
        setShouldRefetchMediaData(true);
      } else {
        openNotification("error", t("Error!"), t("Failed to set image as cover"));
      }
    };

    const handleDownload = async (uuid: string, defaultFileName: string): Promise<void> => {
      showLoader();
      try {
        await runWithDownloadToast(
          {
            downloading: t("Downloading Geotagged Photo"),
            complete: downloadToastMessages.complete,
            error: downloadToastMessages.error
          },
          () => exportImage.downloadFile({ pathParams: { uuid } }, { defaultFileName }),
          `media-download-${uuid}`
        );
      } catch (error) {
        Log.error("Download error:", error);
      } finally {
        hideLoader();
      }
    };

    setCallbacks({ setImageCover, handleDownload, handleDelete, openModalImageDetail, isProjectPath });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [championsMap, entityData, router.isReady, router.asPath]);

  useEffect(
    () => () => {
      const mapInstance = map.current;
      if (mapInstance == null) return;
      if (championsMap) {
        removeMediaMarkers(mapInstance);
      } else {
        removeMediaSymbolLayer(mapInstance);
      }
    },
    [map, championsMap]
  );

  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady) return;

    if (hideMediaOnMap) {
      if (championsMap) {
        removeMediaMarkers(mapInstance);
      } else {
        removeMediaSymbolLayer(mapInstance);
      }
      return;
    }

    if (mediaFiles == null || callbacks == null) return;

    if (championsMap) {
      addMediaMarkers(mapInstance, mediaFiles, callbacks, photosVisible, hideMediaPopupActions);
    } else {
      upsertMediaSymbolLayer(mapInstance, mediaFiles, callbacks, photosVisible);
    }
  }, [
    map,
    mediaFiles,
    callbacks,
    styleReady,
    styleVersion,
    championsMap,
    photosVisible,
    hideMediaPopupActions,
    hideMediaOnMap
  ]);
}
