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

const runRequest = <TResponse>(
  request: (handlers: { onSuccess: (response: TResponse) => void; onError: (error: unknown) => void }) => void
): Promise<TResponse> =>
  new Promise((resolve, reject) => {
    request({ onSuccess: resolve, onError: reject });
  });

export const useUploadPolygons = ({ siteUuid, onUploadSuccess, onError }: UseUploadPolygonsOptions) => {
  const [isComparing, setIsComparing] = useState(false);

  const uploadGeometry = useUploadGeometry({});
  const compareGeometry = useCompareGeometry({});
  const uploadGeometryWithVersions = useUploadGeometryWithVersions({});

  const uploadNew = useCallback(
    (file: File) => {
      const attributes = prepareGeometryForUpload(file, siteUuid);
      uploadGeometry(attributes, {
        onSuccess: () => onUploadSuccess(),
        onError: error => onError(extractErrorMessage(error))
      });
    },
    [siteUuid, uploadGeometry, onUploadSuccess, onError]
  );

  const compareFile = useCallback(
    async (file: File): Promise<string[]> => {
      setIsComparing(true);
      try {
        const attributes = prepareGeometryForUpload(file, siteUuid);
        const response = await runRequest<CompareGeometryFileResponse>(handlers =>
          compareGeometry(attributes, handlers)
        );
        return response.data?.attributes?.existingUuids ?? [];
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
    (file: File) => {
      const attributes = prepareGeometryForUpload(file, siteUuid);
      uploadGeometryWithVersions(attributes, {
        onSuccess: () => onUploadSuccess(),
        onError: error => onError(extractErrorMessage(error))
      });
    },
    [siteUuid, uploadGeometryWithVersions, onUploadSuccess, onError]
  );

  return { uploadNew, compareFile, uploadWithVersions, isComparing };
};
