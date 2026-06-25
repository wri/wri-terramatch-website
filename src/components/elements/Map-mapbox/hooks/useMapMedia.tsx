import { useT } from "@transifex/react";
import { Map as MapboxMap } from "mapbox-gl";
import React, { MutableRefObject, useEffect, useRef } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { deleteMedia, updateMedia } from "@/connections/Media";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { openEditPhotoDetailsFromMapPopup } from "@/context/mapArea.utils";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { exportImage } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { TranslatedText } from "@/i18n/types";
import { runWithDownloadToast } from "@/utils/downloadToast";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";

import { useChampionsMap } from "../championsMap.context";
import { addMediaMarkers, removeMediaMarkers } from "../layers/mediaMarkers";
import { addMediaSymbolLayer, removeMediaSymbolLayer } from "../layers/mediaSymbolLayer";
import { MediaCallbacks } from "../layers/mediaTypes";

type UseMapMediaParams = {
  map: MutableRefObject<MapboxMap | null>;
  mediaFiles?: MediaDto[];
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
  const { showPhotosOnMap } = useMapAreaContext();
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const showPhotosWhileDrawerClosed =
    !hideMediaOnMap && championsMap && !alwaysShowPhotosOnMap && !isPolygonEditDrawerOpen;
  const wantsPhotosOnMap = !hideMediaOnMap && (alwaysShowPhotosOnMap || showPhotosWhileDrawerClosed || showPhotosOnMap);
  const photosVisible = wantsPhotosOnMap && !isPolygonGeometryLoading;
  const callbacksRef = useRef<MediaCallbacks | null>(null);

  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady || hideMediaOnMap || mediaFiles == null) return;

    const isProjectPath = router.isReady && router.asPath.includes("project");

    const handleDelete = async (id: string) => {
      try {
        await runWithDownloadToast(
          {
            downloading: t("Deleting a geotagged photo…"),
            complete: t("Photo Deleted"),
            error: t("Failed to delete image.")
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
          },
          `media-delete-${id}`
        );
      } catch (error) {
        Log.error(error);
      }
    };

    const openModalImageDetail = (data: MediaDto) => {
      if (championsMap) {
        openEditPhotoDetailsFromMapPopup(data);
        return;
      }

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
            downloading: t("Downloading a geotagged photo…"),
            complete: t("Download Complete"),
            error: t("Download Failed")
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

    const callbacks: MediaCallbacks = {
      setImageCover,
      handleDownload,
      handleDelete,
      openModalImageDetail,
      isProjectPath
    };
    callbacksRef.current = callbacks;

    if (championsMap) {
      addMediaMarkers(mapInstance, mediaFiles, callbacks, false, hideMediaPopupActions);
      return () => {
        removeMediaMarkers(mapInstance);
        callbacksRef.current = null;
      };
    }

    removeMediaSymbolLayer(mapInstance);

    return () => {
      removeMediaSymbolLayer(mapInstance);
      callbacksRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaFiles, styleReady, styleVersion, championsMap, hideMediaPopupActions, hideMediaOnMap]);

  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady) return;

    if (hideMediaOnMap || mediaFiles == null) {
      if (championsMap) {
        removeMediaMarkers(mapInstance);
      } else {
        removeMediaSymbolLayer(mapInstance);
      }
      return;
    }

    const callbacks = callbacksRef.current;
    if (callbacks == null) return;

    if (championsMap) {
      addMediaMarkers(mapInstance, mediaFiles, callbacks, photosVisible, hideMediaPopupActions);
      return;
    }

    if (!photosVisible) {
      removeMediaSymbolLayer(mapInstance);
      return;
    }

    addMediaSymbolLayer(mapInstance, mediaFiles, callbacks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosVisible, championsMap, styleReady, mediaFiles, hideMediaPopupActions, hideMediaOnMap]);
}
