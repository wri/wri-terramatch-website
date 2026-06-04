import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useCallback, useMemo, useState } from "react";

import { clipSinglePolygon } from "@/connections/PolygonClipping";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { usePolygonClippingCompletion } from "@/hooks/usePolygonClippingCompletion";
import FloatingActionToolbar from "@/redesignComponents/navigation/Toolbar/FloatingActionToolbar";
import Log from "@/utils/log";

import { extractClippedVersions } from "../hooks/overlapFix.utils";
import { usePolygonValidationCriteria } from "../hooks/usePolygonValidationCriteria";
import {
  getPolygonOperationToastLabels,
  showPolygonCompleteToast,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";
import type { PolygonOverlapFixCallback } from "./polygonEdit.types";
import SubmissionValidationTags from "./SubmissionValidationTags";
import ValidationDetail from "./ValidationDetail";

export type PolygonSystemValidationContentProps = {
  polygon?: SitePolygonLightDto;
  onOverlapFixed?: PolygonOverlapFixCallback;
};

const TOAST_PLACEMENT = "bottom-end" as const;

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

const PolygonSystemValidationContent: FC<PolygonSystemValidationContentProps> = ({ polygon, onOverlapFixed }) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const polygonUuid = polygon?.polygonUuid ?? undefined;
  const { items, hasValidation, failedCount, totalItems, lastValidationDate, hasOverlaps, fixabilityResult } =
    usePolygonValidationCriteria(polygonUuid, polygon?.validationStatus);
  const [pendingClipping, setPendingClipping] = useState(false);

  usePolygonClippingCompletion({
    pendingClipping,
    setPendingClipping,
    onSuccess: async completedClippingJob => {
      if (polygonUuid == null || polygonUuid === "" || onOverlapFixed == null) {
        return;
      }

      const clippedVersions = extractClippedVersions({ data: completedClippingJob.payload?.data });

      try {
        const updatedPolygon = await onOverlapFixed({
          previousPolygonUuid: polygonUuid,
          primaryUuid: polygon?.primaryUuid,
          sitePolygonUuid: polygon?.uuid,
          clippedVersions
        });

        if (updatedPolygon != null) {
          showPolygonCompleteToast(toastLabels.fixingOverlapsComplete);
          return;
        }

        showToast({
          label: t("No polygon have been fixed"),
          type: "warning",
          placement: TOAST_PLACEMENT,
          duration: 5000
        });
      } catch (error) {
        Log.error("Failed to refresh polygon after overlap fix:", error);
        showToast({
          label: t("Overlap was fixed but the polygon could not be refreshed. Please close and reopen the drawer."),
          type: "warning",
          placement: TOAST_PLACEMENT,
          duration: 7000
        });
      }
    },
    onFailure: () => {
      Log.error("Polygon overlap fix failed");
      showPolygonErrorToast(t("Failed to fix polygon overlaps"));
    }
  });

  const handleFixOverlap = useCallback(() => {
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

    showPolygonProgressToast(t, toastLabels.fixingOverlapsProgress);
    clipSinglePolygon(polygonUuid);
    setPendingClipping(true);
  }, [fixabilityResult, pendingClipping, polygonUuid, t, toastLabels.fixingOverlapsProgress]);

  const canFixOverlap =
    hasOverlaps &&
    (fixabilityResult == null || fixabilityResult.canBeFixed) &&
    polygonUuid != null &&
    polygonUuid !== "";

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
          ) : (
            <Text textStyle="300" color="neutral.800">
              {t("No criteria checked yet")}
            </Text>
          )}
        </Flex>
      </Flex>
      {canFixOverlap && (
        <Flex className="w-full justify-center pb-2">
          <FloatingActionToolbar
            className="bg-theme-neutral-200"
            items={[
              {
                onClick: handleFixOverlap,
                label: pendingClipping ? t("Fixing overlap...") : t("Fix Overlap")
              }
            ]}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default PolygonSystemValidationContent;
