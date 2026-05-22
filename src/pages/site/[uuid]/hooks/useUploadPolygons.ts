import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useState } from "react";

import {
  prepareGeometryForUpload,
  useCompareGeometry,
  useUploadGeometry,
  useUploadGeometryWithVersions
} from "@/connections/GeometryUpload";
import { CompareGeometryFileResponse } from "@/generated/v3/researchService/researchServiceComponents";

export type UploadMode = "new-polygons" | "update-existing-polygons";

export type GeometryUploadComparisonResult = {
  existingUuids: string[];
  totalFeatures: number;
  featuresForVersioning: number;
  featuresForCreation: number;
};

const TOAST_PLACEMENT = "top-end" as const;
const UPLOADING_TOAST_DURATION_MS = 4000;
const UPLOAD_COMPLETE_TOAST_DURATION_MS = 5000;

type UseUploadPolygonsOptions = {
  siteUuid: string;
  onUploadSuccess: () => void;
  onError: (message: string) => void;
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

export const useUploadPolygons = ({ siteUuid, onUploadSuccess, onError }: UseUploadPolygonsOptions) => {
  const t = useT();
  const [isComparing, setIsComparing] = useState(false);

  const uploadGeometry = useUploadGeometry({});
  const compareGeometry = useCompareGeometry({});
  const uploadGeometryWithVersions = useUploadGeometryWithVersions({});

  const showUploadingToast = useCallback(() => {
    showToast({
      label: t("Uploading Polygons…"),
      type: "info",
      placement: TOAST_PLACEMENT,
      duration: UPLOADING_TOAST_DURATION_MS
    });
  }, [t]);

  const showUploadCompleteToast = useCallback(() => {
    showToast({
      label: t("Upload Complete"),
      type: "success",
      placement: TOAST_PLACEMENT,
      duration: UPLOAD_COMPLETE_TOAST_DURATION_MS
    });
  }, [t]);

  const handleUploadSuccess = useCallback(() => {
    showUploadCompleteToast();
    onUploadSuccess();
  }, [showUploadCompleteToast, onUploadSuccess]);

  const startUpload = useCallback(
    (
      file: File,
      upload: (
        attributes: ReturnType<typeof prepareGeometryForUpload>,
        handlers: { onSuccess: () => void; onError: (error: unknown) => void }
      ) => void
    ) => {
      showUploadingToast();
      const attributes = prepareGeometryForUpload(file, siteUuid);
      upload(attributes, {
        onSuccess: handleUploadSuccess,
        onError: error => onError(extractErrorMessage(error))
      });
    },
    [siteUuid, showUploadingToast, handleUploadSuccess, onError]
  );

  const uploadNew = useCallback((file: File) => startUpload(file, uploadGeometry), [startUpload, uploadGeometry]);

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
    (file: File) => startUpload(file, uploadGeometryWithVersions),
    [startUpload, uploadGeometryWithVersions]
  );

  return { uploadNew, compareFile, uploadWithVersions, isComparing };
};
