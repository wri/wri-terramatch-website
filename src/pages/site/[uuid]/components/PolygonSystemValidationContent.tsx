import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import { clipPolygonListAsync } from "@/connections/PolygonClipping";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import FloatingActionToolbar from "@/redesignComponents/navigation/Toolbar/FloatingActionToolbar";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";
import { trackPolygonRunValidationClicked } from "@/utils/polygonAnalytics";

import { collectRelatedPartnerUuidsFromFixability, extractClippedVersions } from "../hooks/overlapFix.utils";
import { usePolygonValidationCriteria } from "../hooks/usePolygonValidationCriteria";
import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getPolygonOperationToastLabels,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast
} from "../utils/polygonOperationToasts";
import type { PolygonOverlapFixCallback } from "./polygonEdit.types";
import SubmissionValidationTags from "./SubmissionValidationTags";
import ValidationDetail from "./ValidationDetail";

export type PolygonSystemValidationContentProps = {
  siteUuid: string;
  polygon?: SitePolygonLightDto;
  onOverlapFixed?: PolygonOverlapFixCallback;
  onRunValidation?: (geometryPolygonUuids: string[]) => Promise<void>;
};

const formatValidationCheckedAt = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return `${localDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  })} on ${localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  })}`;
};

const PolygonSystemValidationContent: FC<PolygonSystemValidationContentProps> = ({
  siteUuid,
  polygon,
  onOverlapFixed,
  onRunValidation
}) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const polygonUuid = polygon?.polygonUuid ?? undefined;
  const {
    items,
    hasValidation,
    isLoadingValidation,
    failedCount,
    totalItems,
    lastValidationDate,
    hasOverlaps,
    fixabilityResult
  } = usePolygonValidationCriteria(polygonUuid, polygon?.validationStatus);
  const [pendingClipping, setPendingClipping] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleFixOverlap = useCallback(async () => {
    if (pendingClipping) {
      return;
    }

    if (polygonUuid == null || polygonUuid === "") {
      Log.error("Cannot fix polygon overlaps: geometry polygon UUID is missing");
      return;
    }

    if (fixabilityResult != null && !fixabilityResult.canBeFixed) {
      return;
    }

    if (onOverlapFixed == null) {
      return;
    }

    setPendingClipping(true);
    trackPolygonEvent("polygon_overlap_fix_clicked", {
      ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
      polygon_id: polygonUuid
    });

    const relatedPartnerUuids = collectRelatedPartnerUuidsFromFixability([fixabilityResult]);

    try {
      const response = await clipPolygonListAsync([polygonUuid]);
      const clippedVersions = extractClippedVersions(response);
      await onOverlapFixed({
        previousPolygonUuid: polygonUuid,
        primaryUuid: polygon?.primaryUuid,
        sitePolygonUuid: polygon?.uuid,
        clippedVersions,
        relatedPartnerUuids
      });
    } catch (error) {
      Log.error("Failed to fix polygon overlaps:", error);
      showPolygonErrorToast(t("Failed to Fix Polygon Overlaps"));
    } finally {
      setPendingClipping(false);
    }
  }, [
    fixabilityResult,
    onOverlapFixed,
    pendingClipping,
    polygon?.primaryUuid,
    polygon?.uuid,
    polygonUuid,
    siteUuid,
    t
  ]);

  const canFixOverlap =
    hasOverlaps &&
    (fixabilityResult == null || fixabilityResult.canBeFixed) &&
    polygonUuid != null &&
    polygonUuid !== "";

  const canRunValidation =
    !hasValidation && !isLoadingValidation && polygonUuid != null && polygonUuid !== "" && onRunValidation != null;

  const handleRunValidation = useCallback(async () => {
    if (isValidating || !canRunValidation || polygonUuid == null || polygonUuid === "") {
      return;
    }

    setIsValidating(true);
    trackPolygonRunValidationClicked({ siteUuid, polygonIds: [polygonUuid] });
    try {
      await onRunValidation([polygonUuid]);
      completePolygonProgressToast(POLYGON_TOAST_IDS.validating, toastLabels.validatingComplete);
    } catch (error) {
      Log.error("Failed to validate polygon:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.validating);
      showPolygonErrorToast(t("Failed to Validate Polygons"));
    } finally {
      setIsValidating(false);
    }
  }, [canRunValidation, isValidating, onRunValidation, polygonUuid, siteUuid, t, toastLabels]);

  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <Flex className="mr-[0.25rem] min-h-0 flex-1 flex-col gap-2 overflow-auto py-5 px-2 pl-6 pr-7">
        <SubmissionValidationTags polygon={polygon} />
        <Flex direction="column" gap={3} className="mt-4">
          {hasValidation ? (
            <>
              <ValidationDetail failedCount={failedCount} totalItems={totalItems} items={items} />
              {lastValidationDate != null && (
                <Text textStyle="200" color="neutral.700">
                  {t("Last check at {date}", { date: formatValidationCheckedAt(lastValidationDate) })}
                </Text>
              )}
              {hasOverlaps && fixabilityResult != null && fixabilityResult.reasons.length > 0 && (
                <Text textStyle="200" color="neutral.800">
                  {fixabilityResult.canBeFixed
                    ? t("This polygon can be fixed automatically (≤3.5% overlap, ≤0.1 ha area).")
                    : fixabilityResult.reasons.join(". ")}
                </Text>
              )}
            </>
          ) : isLoadingValidation ? (
            <Flex alignItems="center" gap={2}>
              <LoadingIcon boxSize={5} color="primary.700" animation="spin 1s linear infinite" />
              <Text textStyle="400" color="neutral.800">
                {t("Loading validation...")}
              </Text>
            </Flex>
          ) : (
            <Text textStyle="600-bold" color="neutral.900">
              {t("Validation not started.")}
            </Text>
          )}
        </Flex>
      </Flex>
      {(canRunValidation || canFixOverlap) && (
        <Flex className="w-full justify-center pb-2">
          <FloatingActionToolbar
            className="bg-theme-neutral-200"
            items={
              canRunValidation
                ? [
                    {
                      onClick: () => {
                        void handleRunValidation();
                      },
                      label: isValidating ? t("Validating Polygon...") : t("Run Validation"),
                      disabled: isValidating
                    }
                  ]
                : [
                    {
                      onClick: () => {
                        void handleFixOverlap();
                      },
                      label: pendingClipping ? t("Fixing overlap...") : t("Fix Overlap"),
                      disabled: pendingClipping
                    }
                  ]
            }
          />
        </Flex>
      )}
    </Flex>
  );
};

export default PolygonSystemValidationContent;
