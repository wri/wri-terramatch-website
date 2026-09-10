import { useT } from "@transifex/react";
import { useCallback, useMemo, useState } from "react";

import {
  type UploadGeometryResponse,
  type UploadGeometryWithVersionsResponse,
  prepareGeometryForUpload,
  useCompareGeometry,
  useUploadGeometry,
  useUploadGeometryWithVersions
} from "@/connections/GeometryUpload";
import { CompareGeometryFileResponse } from "@/generated/v3/researchService/researchServiceComponents";
import { extractErrorMessage } from "@/utils/errors";
import {
  classifyUploadFailureErrorType,
  inferUploadFileFormat,
  trackPolygonUploadAttempted,
  trackPolygonUploadError,
  trackPolygonUploadFailed,
  trackPolygonUploadSucceeded
} from "@/utils/polygonAnalytics";

import {
  type PolygonToastId,
  closePolygonProgressToast,
  completePolygonProgressToast,
  getPolygonOperationToastLabels,
  getUpdatingPolygonsProgressLabel,
  getUploadingPolygonsProgressLabel,
  POLYGON_TOAST_IDS,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";
import {
  type DuplicatePolygonUploadInfo,
  extractPureDuplicateFromUploadResponse
} from "../utils/polygonUploadDuplicate";

export type UploadMode = "new-polygons" | "update-existing-polygons";

export type GeometryUploadComparisonResult = {
  existingUuids: string[];
  totalFeatures: number;
  featuresForVersioning: number;
  featuresForCreation: number;
};

const ACCEPTED_UPLOAD_EXTENSIONS = [".geojson", ".kml", ".zip"] as const;

type UseUploadPolygonsOptions = {
  siteUuid: string;
  siteHasExistingPolygons?: boolean;
  onUploadSuccess: (result: UploadPolygonsSuccessResult) => void;
  onDuplicateDetected?: (duplicate: DuplicatePolygonUploadInfo) => void;
  onError: (message: string) => void;
};

export type UploadPolygonsSuccessResult = {
  createdSitePolygonUuid: string | null;
  uploadedFileCount: number;
};

export type { DuplicatePolygonUploadInfo };

type GeometryUploadHandler = (
  attributes: ReturnType<typeof prepareGeometryForUpload>,
  handlers: {
    onSuccess: (response: UploadGeometryResponse | UploadGeometryWithVersionsResponse) => void;
    onError: (error: unknown) => void;
  }
) => void;

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
  if (extractPureDuplicateFromUploadResponse(response) != null) {
    return null;
  }

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

export const useUploadPolygons = ({
  siteUuid,
  siteHasExistingPolygons = false,
  onUploadSuccess,
  onDuplicateDetected,
  onError
}: UseUploadPolygonsOptions) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const [isComparing, setIsComparing] = useState(false);

  const uploadGeometry = useUploadGeometry({});
  const compareGeometry = useCompareGeometry({});
  const uploadGeometryWithVersions = useUploadGeometryWithVersions({});

  const uploadFiles = useCallback(
    async (
      files: File[],
      upload: GeometryUploadHandler,
      labels: { progress: string; complete: string },
      toastId: PolygonToastId
    ): Promise<void> => {
      if (files.length === 0) {
        return;
      }

      const fileFormats = files.map(file => inferUploadFileFormat(file.name)).join(",");
      trackPolygonUploadAttempted({ siteUuid, fileFormat: fileFormats });

      showPolygonProgressToast(t, labels.progress, toastId);

      try {
        const responses = await Promise.all(files.map(file => runGeometryUpload(file, siteUuid, upload)));
        const pureDuplicates = responses
          .map(response => extractPureDuplicateFromUploadResponse(response))
          .filter((duplicate): duplicate is DuplicatePolygonUploadInfo => duplicate != null);
        const nonDuplicateResponses = responses.filter(
          response => extractPureDuplicateFromUploadResponse(response) == null
        );
        const hasCreatedPolygons = nonDuplicateResponses.length > 0;
        const firstDuplicate = pureDuplicates[0] ?? null;

        if (hasCreatedPolygons) {
          completePolygonProgressToast(toastId, labels.complete);
          trackPolygonUploadSucceeded({
            siteUuid,
            polygonCount: nonDuplicateResponses.length,
            isReupload: siteHasExistingPolygons
          });
          onUploadSuccess(buildUploadSuccessResult(files, nonDuplicateResponses));
        } else if (firstDuplicate != null && onDuplicateDetected != null) {
          closePolygonProgressToast(toastId);
          onDuplicateDetected(firstDuplicate);
        } else {
          completePolygonProgressToast(toastId, labels.complete);
          trackPolygonUploadSucceeded({
            siteUuid,
            polygonCount: responses.length,
            isReupload: siteHasExistingPolygons
          });
          onUploadSuccess(buildUploadSuccessResult(files, responses));
        }

        if (hasCreatedPolygons && firstDuplicate != null && onDuplicateDetected != null) {
          onDuplicateDetected(firstDuplicate);
        }
      } catch (error) {
        closePolygonProgressToast(toastId);
        const errorMessage = extractErrorMessage(error);
        trackPolygonUploadFailed({
          siteUuid,
          errorType: classifyUploadFailureErrorType(errorMessage)
        });
        onError(errorMessage);
      }
    },
    [onDuplicateDetected, onError, onUploadSuccess, siteHasExistingPolygons, siteUuid, t]
  );

  const uploadNewFiles = useCallback(
    (files: File[]) => {
      void uploadFiles(
        files,
        uploadGeometry,
        {
          progress: getUploadingPolygonsProgressLabel(t, files.length),
          complete: toastLabels.uploadingPolygonsComplete
        },
        POLYGON_TOAST_IDS.uploading
      );
    },
    [t, toastLabels.uploadingPolygonsComplete, uploadFiles, uploadGeometry]
  );

  const uploadWithVersionsFiles = useCallback(
    (files: File[], polygonCount?: number) => {
      void uploadFiles(
        files,
        uploadGeometryWithVersions,
        {
          progress: getUpdatingPolygonsProgressLabel(t, polygonCount ?? files.length),
          complete: toastLabels.updatingPolygonsComplete
        },
        POLYGON_TOAST_IDS.updating
      );
    },
    [t, toastLabels.updatingPolygonsComplete, uploadFiles, uploadGeometryWithVersions]
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
        const errorMessage = extractErrorMessage(error);
        trackPolygonUploadError({
          siteUuid,
          errorType: classifyUploadFailureErrorType(errorMessage)
        });
        onError(errorMessage);
        throw error;
      } finally {
        setIsComparing(false);
      }
    },
    [compareGeometry, onError, siteUuid]
  );

  return { uploadNewFiles, compareFiles, uploadWithVersionsFiles, isComparing };
};
