import { useCallback, useState } from "react";

import {
  prepareGeometryForUpload,
  useCompareGeometry,
  useUploadGeometry,
  useUploadGeometryWithVersions
} from "@/connections/GeometryUpload";
import { CompareGeometryFileResponse } from "@/generated/v3/researchService/researchServiceComponents";

export type UploadMode = "new-polygons" | "update-existing-polygons";

type UseUploadPolygonsOptions = {
  siteUuid: string;
  onUploadSuccess: () => void;
  onMatchingPolygonsFound: (existingUuids: string[], confirmUpload: () => Promise<void>) => void;
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

export const useUploadPolygons = ({
  siteUuid,
  onUploadSuccess,
  onMatchingPolygonsFound,
  onError
}: UseUploadPolygonsOptions) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadGeometry = useUploadGeometry({});
  const compareGeometry = useCompareGeometry({});
  const uploadGeometryWithVersions = useUploadGeometryWithVersions({});

  const uploadNewPolygons = useCallback(
    async (file: File) => {
      setIsUploading(true);
      const attributes = prepareGeometryForUpload(file, siteUuid);
      await new Promise<void>((resolve, reject) => {
        uploadGeometry(attributes, { onSuccess: () => resolve(), onError: reject });
      })
        .then(onUploadSuccess)
        .catch(err => onError(extractErrorMessage(err)))
        .finally(() => setIsUploading(false));
    },
    [siteUuid, uploadGeometry, onUploadSuccess, onError]
  );

  const uploadWithVersions = useCallback(
    async (file: File) => {
      setIsUploading(true);
      const attributes = prepareGeometryForUpload(file, siteUuid);
      await new Promise<void>((resolve, reject) => {
        uploadGeometryWithVersions(attributes, { onSuccess: () => resolve(), onError: reject });
      })
        .then(onUploadSuccess)
        .catch(err => onError(extractErrorMessage(err)))
        .finally(() => setIsUploading(false));
    },
    [siteUuid, uploadGeometryWithVersions, onUploadSuccess, onError]
  );

  const compareAndPromptVersioning = useCallback(
    async (file: File) => {
      setIsUploading(true);
      const attributes = prepareGeometryForUpload(file, siteUuid);

      new Promise<CompareGeometryFileResponse>((resolve, reject) => {
        compareGeometry(attributes, { onSuccess: resolve, onError: reject });
      })
        .then(response => {
          const attrs = response.data?.attributes;
          const existingUuids = attrs?.existingUuids ?? [];
          onMatchingPolygonsFound(existingUuids, () => uploadWithVersions(file));
        })
        .catch(err => onError(extractErrorMessage(err)))
        .finally(() => setIsUploading(false));
    },
    [siteUuid, compareGeometry, uploadWithVersions, onMatchingPolygonsFound, onError]
  );

  const upload = useCallback(
    (mode: UploadMode, file: File) => {
      if (mode === "new-polygons") return uploadNewPolygons(file);
      return compareAndPromptVersioning(file);
    },
    [uploadNewPolygons, compareAndPromptVersioning]
  );

  return { upload, isUploading };
};
