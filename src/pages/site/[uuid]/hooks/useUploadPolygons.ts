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

const ACCEPTED_UPLOAD_EXTENSIONS = [".geojson", ".kml", ".zip"] as const;

type UseUploadPolygonsOptions = {
  siteUuid: string;
  onUploadSuccess: (result: UploadPolygonsSuccessResult) => void;
  onError: (message: string) => void;
};

export type UploadPolygonsSuccessResult = {
  createdSitePolygonUuid: string | null;
  uploadedFileCount: number;
};

type GeometryUploadHandler = (
  attributes: ReturnType<typeof prepareGeometryForUpload>,
  handlers: {
    onSuccess: (response: UploadGeometryResponse | UploadGeometryWithVersionsResponse) => void;
    onError: (error: unknown) => void;
  }
) => void;

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

const mergeComparisonResults = (results: GeometryUploadComparisonResult[]): GeometryUploadComparisonResult => {
  const existingUuidSet = new Set<string>();

  return results.reduce<GeometryUploadComparisonResult>(
    (merged, result) => {
      result.existingUuids.forEach(uuid => existingUuidSet.add(uuid));
      return {
        existingUuids: Array.from(existingUuidSet),
        totalFeatures: merged.totalFeatures + result.totalFeatures,
        featuresForVersioning: merged.featuresForVersioning + result.featuresForVersioning,
        featuresForCreation: merged.featuresForCreation + result.featuresForCreation
      };
    },
    {
      existingUuids: [],
      totalFeatures: 0,
      featuresForVersioning: 0,
      featuresForCreation: 0
    }
  );
};

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

const buildUploadSuccessResult = (
  files: File[],
  responses: Array<UploadGeometryResponse | UploadGeometryWithVersionsResponse>
): UploadPolygonsSuccessResult => {
  const createdSitePolygonUuids = responses
    .map(getCreatedSitePolygonUuid)
    .filter((uuid): uuid is string => uuid != null);

  return {
    createdSitePolygonUuid:
      files.length === 1 && createdSitePolygonUuids.length === 1 ? createdSitePolygonUuids[0] : null,
    uploadedFileCount: files.length
  };
};

export const isAcceptedPolygonUploadFile = (file: File): boolean => {
  const lowerName = file.name.toLowerCase();
  return ACCEPTED_UPLOAD_EXTENSIONS.some(extension => lowerName.endsWith(extension));
};

export const collectAcceptedUploadFiles = (fileList: FileList | null): File[] => {
  if (fileList == null) {
    return [];
  }

  return Array.from(fileList).filter(isAcceptedPolygonUploadFile);
};

const runRequest = <TResponse>(
  request: (handlers: { onSuccess: (response: TResponse) => void; onError: (error: unknown) => void }) => void
): Promise<TResponse> =>
  new Promise((resolve, reject) => {
    request({ onSuccess: resolve, onError: reject });
  });

const runGeometryUpload = (
  file: File,
  siteUuid: string,
  upload: GeometryUploadHandler
): Promise<UploadGeometryResponse | UploadGeometryWithVersionsResponse> => {
  const attributes = prepareGeometryForUpload(file, siteUuid);
  return runRequest(handlers => upload(attributes, handlers));
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

  const uploadFiles = useCallback(
    async (
      files: File[],
      upload: GeometryUploadHandler,
      toastLabels: { progress: string; complete: string }
    ): Promise<void> => {
      if (files.length === 0) {
        return;
      }

      showProgressToast(toastLabels.progress);

      try {
        const responses = await Promise.all(files.map(file => runGeometryUpload(file, siteUuid, upload)));
        showCompleteToast(toastLabels.complete);
        onUploadSuccess(buildUploadSuccessResult(files, responses));
      } catch (error) {
        onError(extractErrorMessage(error));
      }
    },
    [onError, onUploadSuccess, showCompleteToast, showProgressToast, siteUuid]
  );

  const uploadNewFiles = useCallback(
    (files: File[]) => {
      void uploadFiles(files, uploadGeometry, {
        progress: t("Uploading Polygons..."),
        complete: t("Upload Complete")
      });
    },
    [t, uploadFiles, uploadGeometry]
  );

  const uploadWithVersionsFiles = useCallback(
    (files: File[]) => {
      void uploadFiles(files, uploadGeometryWithVersions, {
        progress: t("Updating Polygons..."),
        complete: t("Update Complete")
      });
    },
    [t, uploadFiles, uploadGeometryWithVersions]
  );

  const compareFiles = useCallback(
    async (files: File[]): Promise<GeometryUploadComparisonResult> => {
      if (files.length === 0) {
        return {
          existingUuids: [],
          totalFeatures: 0,
          featuresForVersioning: 0,
          featuresForCreation: 0
        };
      }

      setIsComparing(true);
      try {
        const comparisons = await Promise.all(
          files.map(file => {
            const attributes = prepareGeometryForUpload(file, siteUuid);
            return runRequest<CompareGeometryFileResponse>(handlers => compareGeometry(attributes, handlers)).then(
              parseComparisonResult
            );
          })
        );
        return mergeComparisonResults(comparisons);
      } catch (error) {
        onError(extractErrorMessage(error));
        throw error;
      } finally {
        setIsComparing(false);
      }
    },
    [compareGeometry, onError, siteUuid]
  );

  return { uploadNewFiles, compareFiles, uploadWithVersionsFiles, isComparing };
};
