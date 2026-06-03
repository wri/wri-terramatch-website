import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { createElement, useCallback, useState } from "react";

import {
  type UploadGeometryResponse,
  type UploadGeometryWithVersionsResponse,
  prepareGeometryForUpload,
  useCompareGeometry,
  useUploadGeometry,
  useUploadGeometryWithVersions
} from "@/connections/GeometryUpload";
import { CompareGeometryFileResponse } from "@/generated/v3/researchService/researchServiceComponents";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

export type UploadMode = "new-polygons" | "update-existing-polygons";

export type GeometryUploadComparisonResult = {
  existingUuids: string[];
  totalFeatures: number;
  featuresForVersioning: number;
  featuresForCreation: number;
};

const TOAST_PLACEMENT = "bottom-end" as const;
const UPLOADING_TOAST_DURATION_MS = 4000;
const UPLOAD_COMPLETE_TOAST_DURATION_MS = 5000;

type UseUploadPolygonsOptions = {
  siteUuid: string;
  onUploadSuccess: (result: UploadPolygonsSuccessResult) => void;
  onError: (message: string) => void;
};

export type UploadPolygonsSuccessResult = {
  createdSitePolygonUuid: string | null;
};

const extractErrorMessage = (error: unknown): string => {
  if (error == null || typeof error !== "object") return "An unknown error occurred";
  if ("message" in error) {
    try {
      const parsed = JSON.parse((error as { message: string }).message);
      return parsed?.message ?? (error as { message: string }).message;
    } catch {
      return (error as { message: string }).message;
    }
  }
  return "An unknown error occurred";
};

const parseComparisonResult = (response: CompareGeometryFileResponse): GeometryUploadComparisonResult => {
  const attrs = response.data?.attributes;
  return {
    existingUuids: attrs?.existingUuids ?? [],
    totalFeatures: attrs?.totalFeatures ?? 0,
    featuresForVersioning: attrs?.featuresForVersioning ?? 0,
    featuresForCreation: attrs?.featuresForCreation ?? 0
  };
};

const runRequest = <TResponse>(
  request: (handlers: { onSuccess: (response: TResponse) => void; onError: (error: unknown) => void }) => void
): Promise<TResponse> =>
  new Promise((resolve, reject) => {
    request({ onSuccess: resolve, onError: reject });
  });

const getCreatedSitePolygonUuid = (
  response: UploadGeometryResponse | UploadGeometryWithVersionsResponse
): string | null => {
  const responseResourceType = response.meta?.resourceType ?? response.data?.type;
  if (responseResourceType !== "sitePolygons") {
    return null;
  }

  const createdSitePolygonUuid = response.data?.id;
  return createdSitePolygonUuid != null && createdSitePolygonUuid.length > 0 ? createdSitePolygonUuid : null;
};

export const useUploadPolygons = ({ siteUuid, onUploadSuccess, onError }: UseUploadPolygonsOptions) => {
  const t = useT();
  const [isComparing, setIsComparing] = useState(false);

  const uploadGeometry = useUploadGeometry({});
  const compareGeometry = useCompareGeometry({});
  const uploadGeometryWithVersions = useUploadGeometryWithVersions({});

  const showProgressToast = useCallback((label: string) => {
    showToast({
      label,
      type: "info",
      placement: TOAST_PLACEMENT,
      duration: UPLOADING_TOAST_DURATION_MS,
      icon: createElement(LoadingIcon, {
        boxSize: 7,
        color: "primary.700",
        animation: "spin 1s linear infinite"
      })
    });
  }, []);

  const showCompleteToast = useCallback((label: string) => {
    showToast({
      label,
      type: "success",
      placement: TOAST_PLACEMENT,
      duration: UPLOAD_COMPLETE_TOAST_DURATION_MS
    });
  }, []);

  const startUpload = useCallback(
    (
      file: File,
      upload: (
        attributes: ReturnType<typeof prepareGeometryForUpload>,
        handlers: {
          onSuccess: (response: UploadGeometryResponse | UploadGeometryWithVersionsResponse) => void;
          onError: (error: unknown) => void;
        }
      ) => void,
      toastLabels: { progress: string; complete: string }
    ) => {
      showProgressToast(toastLabels.progress);
      const attributes = prepareGeometryForUpload(file, siteUuid);
      upload(attributes, {
        onSuccess: response => {
          showCompleteToast(toastLabels.complete);
          onUploadSuccess({ createdSitePolygonUuid: getCreatedSitePolygonUuid(response) });
        },
        onError: error => onError(extractErrorMessage(error))
      });
    },
    [siteUuid, showProgressToast, showCompleteToast, onUploadSuccess, onError]
  );

  const uploadNew = useCallback(
    (file: File) =>
      startUpload(file, uploadGeometry, {
        progress: t("Uploading Polygons..."),
        complete: t("Upload Complete")
      }),
    [startUpload, uploadGeometry, t]
  );

  const compareFile = useCallback(
    async (file: File): Promise<GeometryUploadComparisonResult> => {
      setIsComparing(true);
      try {
        const attributes = prepareGeometryForUpload(file, siteUuid);
        const response = await runRequest<CompareGeometryFileResponse>(handlers =>
          compareGeometry(attributes, handlers)
        );
        return parseComparisonResult(response);
      } catch (error) {
        onError(extractErrorMessage(error));
        throw error;
      } finally {
        setIsComparing(false);
      }
    },
    [siteUuid, compareGeometry, onError]
  );

  const uploadWithVersions = useCallback(
    (file: File) =>
      startUpload(file, uploadGeometryWithVersions, {
        progress: t("Updating Polygons..."),
        complete: t("Update Complete")
      }),
    [startUpload, uploadGeometryWithVersions, t]
  );

  return { uploadNew, compareFile, uploadWithVersions, isComparing };
};
