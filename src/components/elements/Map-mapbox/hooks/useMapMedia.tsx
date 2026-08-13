import { useT } from "@transifex/react";
import { Map as MapboxMap } from "mapbox-gl";
import React, { MutableRefObject, useEffect, useLayoutEffect, useRef } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { deleteMedia, updateMedia } from "@/connections/Media";
import { openEditPhotoDetailsFromMapPopup } from "@/context/mapArea.utils";
import { exportImage } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import { TranslatedText } from "@/i18n/types";
import { runWithDownloadToast } from "@/utils/downloadToast";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";

import { useChampionsMap } from "../championsMap.context";
import { addMediaMarkers, removeMediaMarkers } from "../layers/mediaMarkers";
import { addMediaSymbolLayer, removeMediaSymbolLayer } from "../layers/mediaSymbolLayer";
import { MediaCallbacks } from "../layers/mediaTypes";
import { OverlapPolygonPoint } from "../layers/overlapTypes";
import { useGeotaggedPhotosVisibility } from "./useGeotaggedPhotosVisibility";

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
  isEditFocusActive?: boolean;
  overlapPolygons?: OverlapPolygonPoint[];
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
  isPolygonGeometryLoading = false,
  isEditFocusActive = false,
  overlapPolygons
}: UseMapMediaParams) {
  const championsMap = useChampionsMap();
  const downloadToastMessages = useDownloadToastMessages();
  const photosVisible = useGeotaggedPhotosVisibility({
    alwaysShowPhotosOnMap,
    hideMediaOnMap,
    isPolygonGeometryLoading,
    isEditFocusActive,
    overlapPolygons
  });
  const callbacksRef = useRef<MediaCallbacks | null>(null);

  const applyPhotosVisibility = (mapInstance: MapboxMap): void => {
    if (hideMediaOnMap || mediaFiles == null) {
      if (championsMap) {
        removeMediaMarkers(mapInstance);
      } else {
        removeMediaSymbolLayer(mapInstance);
      }
      return;
    }

    if (championsMap) {
      const callbacks = callbacksRef.current;
      if (callbacks == null) {
        if (!photosVisible) {
          removeMediaMarkers(mapInstance);
        }
        return;
      }
      addMediaMarkers(mapInstance, mediaFiles, callbacks, photosVisible, hideMediaPopupActions);
      return;
    }

    if (!photosVisible) {
      removeMediaSymbolLayer(mapInstance);
      return;
    }

    const callbacks = callbacksRef.current;
    if (callbacks == null) return;
    addMediaSymbolLayer(mapInstance, mediaFiles, callbacks);
  };

  useLayoutEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady || photosVisible) return;
    applyPhotosVisibility(mapInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosVisible, styleReady]);

  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady || hideMediaOnMap || mediaFiles == null) return;

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

    const callbacks: MediaCallbacks = {
      setImageCover,
      handleDownload,
      handleDelete,
      openModalImageDetail,
      isProjectPath
    };
    callbacksRef.current = callbacks;

    if (championsMap) {
      addMediaMarkers(mapInstance, mediaFiles, callbacks, photosVisible, hideMediaPopupActions);
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
    applyPhotosVisibility(mapInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosVisible, championsMap, styleReady, mediaFiles, hideMediaPopupActions, hideMediaOnMap]);
}
