import { useCallback, useEffect, useRef, useState } from "react";

import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { fetchPolygonValidation } from "@/connections/Validation";
import { listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { isValidationPollingResolved } from "@/helpers/polygonValidation";
import Log from "@/utils/log";
import { trackBulkActionCompleted, trackPolygonValidationResults } from "@/utils/polygonAnalytics";

import type { PolygonValidationJobsStartedOptions } from "../components/polygonEdit.types";
import { prunePolygonValidationCache } from "../components/polygonEditSave";
import { showPolygonErrorToast } from "../utils/polygonOperationToasts";

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

type FindTableSitePolygon = (polygonId: string) => { validationStatus?: string | null } | undefined;

type UseSitePolygonValidationStateParams = {
  findTableSitePolygon: FindTableSitePolygon;
};

export const useSitePolygonValidationState = ({ findTableSitePolygon }: UseSitePolygonValidationStateParams) => {
  const [pendingValidationPolygonUuids, setPendingValidationPolygonUuids] = useState<string[]>([]);
  const [validationZoomPolygonUuids, setValidationZoomPolygonUuids] = useState<string[]>([]);
  const [skipNextSiteBboxZoomNonce, setSkipNextSiteBboxZoomNonce] = useState(0);
  const [supplementalValidations, setSupplementalValidations] = useState<ValidationDto[]>([]);

  const priorValidationStatusRef = useRef<Map<string, string | null | undefined>>(new Map());
  const pendingValidationTrackBulkRef = useRef(true);
  const validationRunStartedAtRef = useRef(0);
  const validationAfterCriteriaClearRef = useRef(false);
  const pendingValidationKeyRef = useRef("");
  const validationPollingGenerationRef = useRef(0);

  const clearValidationPending = useCallback(() => {
    validationPollingGenerationRef.current += 1;
    setPendingValidationPolygonUuids([]);
    setValidationZoomPolygonUuids([]);
    validationRunStartedAtRef.current = 0;
    validationAfterCriteriaClearRef.current = false;
    pendingValidationKeyRef.current = "";
  }, []);

  const handleValidationUiCleared = useCallback((geometryPolygonUuids: string[]) => {
    if (geometryPolygonUuids.length === 0) {
      return;
    }

    const clearedUuidSet = new Set(geometryPolygonUuids);
    setSupplementalValidations(prev =>
      prev.filter(validation => validation.polygonUuid == null || !clearedUuidSet.has(validation.polygonUuid))
    );
    setPendingValidationPolygonUuids(prev => {
      const nextPendingValidationUuids = prev.filter(uuid => !clearedUuidSet.has(uuid));
      if (nextPendingValidationUuids.length !== prev.length) {
        validationPollingGenerationRef.current += 1;
      }
      return nextPendingValidationUuids;
    });
  }, []);

  const handleValidationJobsStarted = useCallback(
    (polygonUuids: string[], options?: PolygonValidationJobsStartedOptions) => {
      const priorStatuses = new Map<string, string | null | undefined>();
      polygonUuids.forEach(polygonUuid => {
        const sitePolygon = findTableSitePolygon(polygonUuid);
        priorStatuses.set(polygonUuid, sitePolygon?.validationStatus);
      });
      priorValidationStatusRef.current = priorStatuses;
      pendingValidationTrackBulkRef.current = options?.trackBulkCompletion ?? true;
      validationAfterCriteriaClearRef.current = options?.validationAfterCriteriaClear === true;
      validationRunStartedAtRef.current = Date.now();

      const key = [...polygonUuids].sort().join(",");
      prunePolygonValidationCache(...polygonUuids);
      pendingValidationKeyRef.current = key;
      setSupplementalValidations(prev =>
        prev.filter(validation => validation.polygonUuid == null || !polygonUuids.includes(validation.polygonUuid))
      );
      setPendingValidationPolygonUuids(polygonUuids);
      void listDelayedJobs.fetch({});
    },
    [findTableSitePolygon]
  );

  const handleValidationZoomConsumed = useCallback(() => {
    setValidationZoomPolygonUuids([]);
    setSkipNextSiteBboxZoomNonce(nonce => nonce + 1);
  }, []);

  return {
    pendingValidationPolygonUuids,
    validationZoomPolygonUuids,
    skipNextSiteBboxZoomNonce,
    supplementalValidations,
    setSupplementalValidations,
    setPendingValidationPolygonUuids,
    setValidationZoomPolygonUuids,
    priorValidationStatusRef,
    pendingValidationTrackBulkRef,
    validationRunStartedAtRef,
    validationAfterCriteriaClearRef,
    pendingValidationKeyRef,
    validationPollingGenerationRef,
    clearValidationPending,
    handleValidationUiCleared,
    handleValidationJobsStarted,
    handleValidationZoomConsumed
  };
};

type UseSitePolygonValidationPollParams = {
  siteUuid: string;
  pendingValidationPolygonUuids: string[];
  setPendingValidationPolygonUuids: (value: string[]) => void;
  setSupplementalValidations: React.Dispatch<React.SetStateAction<ValidationDto[]>>;
  setValidationZoomPolygonUuids: (value: string[]) => void;
  priorValidationStatusRef: React.MutableRefObject<Map<string, string | null | undefined>>;
  pendingValidationTrackBulkRef: React.MutableRefObject<boolean>;
  validationRunStartedAtRef: React.MutableRefObject<number>;
  validationAfterCriteriaClearRef: React.MutableRefObject<boolean>;
  pendingValidationKeyRef: React.MutableRefObject<string>;
  validationPollingGenerationRef: React.MutableRefObject<number>;
  clearValidationPending: () => void;
  refetchPolygons: () => Promise<void>;
  fetchPageValidations: (force?: boolean) => Promise<unknown>;
  fetchOverlapValidations: (force?: boolean) => Promise<unknown>;
  isEditPolygonOpen: boolean;
  showValidationResultsModalIfPending: () => void;
  cancelPendingValidationResultsModal: () => void;
  t: TranslateFn;
};

export const useSitePolygonValidationPoll = ({
  siteUuid,
  pendingValidationPolygonUuids,
  setPendingValidationPolygonUuids,
  setSupplementalValidations,
  setValidationZoomPolygonUuids,
  priorValidationStatusRef,
  pendingValidationTrackBulkRef,
  validationRunStartedAtRef,
  validationAfterCriteriaClearRef,
  pendingValidationKeyRef,
  validationPollingGenerationRef,
  clearValidationPending,
  refetchPolygons,
  fetchPageValidations,
  fetchOverlapValidations,
  isEditPolygonOpen,
  showValidationResultsModalIfPending,
  cancelPendingValidationResultsModal,
  t
}: UseSitePolygonValidationPollParams) => {
  const pendingValidationResultsModalWhileDrawerOpenRef = useRef(false);

  const openValidationResultsModalIfPending = useCallback(() => {
    if (isEditPolygonOpen) {
      pendingValidationResultsModalWhileDrawerOpenRef.current = true;
      return;
    }
    showValidationResultsModalIfPending();
  }, [isEditPolygonOpen, showValidationResultsModalIfPending]);

  useEffect(() => {
    if (isEditPolygonOpen || !pendingValidationResultsModalWhileDrawerOpenRef.current) {
      return;
    }
    pendingValidationResultsModalWhileDrawerOpenRef.current = false;
    showValidationResultsModalIfPending();
  }, [isEditPolygonOpen, showValidationResultsModalIfPending]);

  useEffect(() => {
    if (pendingValidationPolygonUuids.length === 0) {
      return;
    }

    let cancelled = false;
    const polygonUuids = pendingValidationPolygonUuids;
    const pollingGeneration = validationPollingGenerationRef.current;

    const resolveValidationForPolygons = async () => {
      try {
        for (let attempt = 0; attempt < 20 && !cancelled; attempt++) {
          if (validationPollingGenerationRef.current !== pollingGeneration) {
            return;
          }

          prunePolygonValidationCache(...polygonUuids);
          void listDelayedJobs.fetch({});
          const individualValidations = await Promise.all(polygonUuids.map(uuid => fetchPolygonValidation(uuid)));

          if (cancelled || validationPollingGenerationRef.current !== pollingGeneration) {
            return;
          }

          const allResolved = individualValidations.every(validation =>
            isValidationPollingResolved(validation, {
              startedAtMs: validationRunStartedAtRef.current,
              validationAfterCriteriaClear: validationAfterCriteriaClearRef.current
            })
          );

          if (allResolved) {
            const fetchedValidations = individualValidations.filter(
              (validation): validation is ValidationDto => validation != null
            );

            setSupplementalValidations(prev => {
              const byPolygonUuid = new Map(prev.map(validation => [validation.polygonUuid, validation]));
              fetchedValidations.forEach(validation => {
                byPolygonUuid.set(validation.polygonUuid, validation);
              });
              return Array.from(byPolygonUuid.values());
            });

            fetchedValidations.forEach(validation => {
              const polygonUuid = validation.polygonUuid;
              if (polygonUuid == null || polygonUuid === "") {
                return;
              }

              trackPolygonValidationResults({
                siteUuid,
                polygonId: polygonUuid,
                validation,
                priorValidationStatus: priorValidationStatusRef.current.get(polygonUuid)
              });
            });

            if (pendingValidationTrackBulkRef.current) {
              trackBulkActionCompleted({
                siteUuid,
                actionType: "run_validation",
                polygonCount: polygonUuids.length
              });
            }

            await refetchPolygons();
            await Promise.all([fetchPageValidations(true), fetchOverlapValidations(true)]);
            pruneBoundingBoxesCache();
            setPendingValidationPolygonUuids([]);
            validationRunStartedAtRef.current = 0;
            validationAfterCriteriaClearRef.current = false;
            pendingValidationKeyRef.current = "";
            setValidationZoomPolygonUuids(polygonUuids);
            openValidationResultsModalIfPending();
            return;
          }

          await new Promise(resolve => window.setTimeout(resolve, 1500));
        }

        if (!cancelled && validationPollingGenerationRef.current === pollingGeneration) {
          cancelPendingValidationResultsModal();
          clearValidationPending();
          showPolygonErrorToast(t("Validation results are taking longer than expected. Please try again."));
        }
      } catch (error) {
        Log.error("Failed while polling polygon validation results:", error);
        if (!cancelled && validationPollingGenerationRef.current === pollingGeneration) {
          cancelPendingValidationResultsModal();
          clearValidationPending();
          showPolygonErrorToast(t("Failed to load validation results. Please try again."));
        }
      }
    };

    void resolveValidationForPolygons();

    return () => {
      cancelled = true;
    };
  }, [
    cancelPendingValidationResultsModal,
    clearValidationPending,
    fetchPageValidations,
    fetchOverlapValidations,
    pendingValidationPolygonUuids,
    pendingValidationKeyRef,
    pendingValidationTrackBulkRef,
    priorValidationStatusRef,
    refetchPolygons,
    openValidationResultsModalIfPending,
    setPendingValidationPolygonUuids,
    setSupplementalValidations,
    setValidationZoomPolygonUuids,
    siteUuid,
    t,
    validationAfterCriteriaClearRef,
    validationPollingGenerationRef,
    validationRunStartedAtRef
  ]);
};
