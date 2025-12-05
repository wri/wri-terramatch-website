import { useT } from "@transifex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalFixOverlaps from "@/components/extensive/Modal/ModalFixOverlaps";
import ModalProcessBulkPolygons from "@/components/extensive/Modal/ModalProcessBulkPolygons";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { clipPolygonList } from "@/connections/PolygonClipping";
import { createPolygonValidation, useAllSiteValidations } from "@/connections/Validation";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useDeleteV2TerrafundProjectPolygons } from "@/generated/apiComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonsFixability, getFixabilitySummaryMessage } from "@/utils/polygonFixValidation";

const ProcessBulkPolygonsControl = ({
  entityData,
  setIsLoadingDelayedJob,
  isLoadingDelayedJob,
  setAlertTitle
}: {
  entityData: any;
  setIsLoadingDelayedJob?: (value: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
}) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const context = useSitePolygonData();
  const {
    selectedPolygonsInCheckbox,
    setSelectedPolygonsInCheckbox,
    setShouldRefetchPolygonData,
    setShouldRefetchValidation
  } = useMapAreaContext();
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const [, { delayedJobs }] = useDelayedJobs();
  const [pendingClipping, setPendingClipping] = useState(false);
  const sitePolygonData = useMemo(
    () => (context?.sitePolygonData ?? []) as Array<SitePolygonLightDto>,
    [context?.sitePolygonData]
  );
  const { mutate: deletePolygons } = useDeleteV2TerrafundProjectPolygons();

  const refetchData = useCallback(() => {
    context?.reloadSiteData();
    setShouldRefetchValidation(true);
    setShouldRefetchPolygonData(true);
    setSelectedPolygonsInCheckbox([]);
  }, [context, setShouldRefetchValidation, setShouldRefetchPolygonData, setSelectedPolygonsInCheckbox]);

  const [fixabilityResult, setFixabilityResult] = useState<{
    fixableCount: number;
    totalCount: number;
    canFixAny: boolean;
  }>({ fixableCount: 0, totalCount: 0, canFixAny: false });

  const { allValidations: overlapValidations } = useAllSiteValidations(entityData?.uuid ?? "", OVERLAPPING_CRITERIA_ID);

  const extractPolygonNames = useCallback((clippedData: any): string => {
    if (Array.isArray(clippedData) && clippedData.length > 0) {
      return clippedData
        .map((item: any) => item.attributes?.polyName)
        .filter(Boolean)
        .join(", ");
    }
    if (clippedData != null && typeof clippedData === "object" && clippedData.attributes?.polyName != null) {
      return clippedData.attributes.polyName;
    }
    return "";
  }, []);

  useEffect(() => {
    if (!pendingClipping || delayedJobs == null || delayedJobs.length === 0) {
      return;
    }

    const completedClippingJob = delayedJobs.find(job => {
      const isCompleted = job.status === "succeeded" || job.status === "failed";
      const isPolygonClipping = job.name === "Polygon Clipping";
      return isCompleted && isPolygonClipping;
    });

    if (completedClippingJob == null) {
      return;
    }

    if (completedClippingJob.status === "succeeded") {
      const clippedData = completedClippingJob.payload?.data;
      const polygonNames = extractPolygonNames(clippedData);

      setIsLoadingDelayedJob?.(false);
      if (polygonNames.length > 0) {
        openNotification("success", t("Success!"), t(`Polygons fixed successfully. Fixed: ${polygonNames}`));
      } else {
        openNotification("warning", t("Warning"), t("No polygons were fixed."));
      }
      ApiSlice.pruneCache("validations");
      refetchData();
    } else {
      hideLoader();
      setIsLoadingDelayedJob?.(false);
      openNotification("error", t("Error!"), t("Failed to fix polygons"));
    }

    setPendingClipping(false);
  }, [
    delayedJobs,
    pendingClipping,
    setIsLoadingDelayedJob,
    openNotification,
    t,
    refetchData,
    hideLoader,
    extractPolygonNames
  ]);

  useEffect(() => {
    const hasSelectedPolygons = selectedPolygonsInCheckbox.length > 0;
    const hasOverlapValidations = overlapValidations.length > 0;

    if (!hasSelectedPolygons || !hasOverlapValidations) {
      setFixabilityResult({ fixableCount: 0, totalCount: 0, canFixAny: false });
      return;
    }

    const selectedPolygonsWithOverlaps = overlapValidations
      .filter(validation => {
        const polygonUuid = validation.polygonUuid ?? "";
        return selectedPolygonsInCheckbox.includes(polygonUuid);
      })
      .map(validation => {
        const overlapCriteria = validation.criteriaList.find(
          criteria => criteria.criteriaId === OVERLAPPING_CRITERIA_ID
        );
        return {
          extra_info: overlapCriteria?.extraInfo
        };
      })
      .filter(polygon => polygon.extra_info != null);

    if (selectedPolygonsWithOverlaps.length === 0) {
      setFixabilityResult({ fixableCount: 0, totalCount: 0, canFixAny: false });
      return;
    }

    const result = checkPolygonsFixability(selectedPolygonsWithOverlaps);
    setFixabilityResult({
      fixableCount: result.fixableCount,
      totalCount: result.totalCount,
      canFixAny: result.fixableCount > 0
    });
  }, [selectedPolygonsInCheckbox, overlapValidations]);

  const handleDeletePolygons = useCallback(
    (currentSelectedUuids: string[]) => {
      showLoader();
      closeModal(ModalId.DELETE_BULK_POLYGONS);
      deletePolygons(
        {
          body: {
            uuids: currentSelectedUuids
          }
        },
        {
          onSuccess: () => {
            refetchData();
            hideLoader();
            openNotification("success", t("Success!"), t("Polygons deleted successfully"));
          },
          onError: () => {
            hideLoader();
            openNotification("error", t("Error!"), t("Failed to delete polygons"));
          }
        }
      );
    },
    [deletePolygons, refetchData, hideLoader, openNotification, t, showLoader, closeModal]
  );

  const openFormModalHandlerProcessBulkPolygons = useCallback(() => {
    openModal(
      ModalId.DELETE_BULK_POLYGONS,
      <ModalProcessBulkPolygons
        title={t("Delete Polygons")}
        onClose={() => closeModal(ModalId.DELETE_BULK_POLYGONS)}
        content={t("Confirm that the following polygons will be deleted. This operation is not reversible.")}
        primaryButtonText={t("Delete")}
        onClick={handleDeletePolygons}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary"
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.DELETE_BULK_POLYGONS)
        }}
        sitePolygonData={sitePolygonData}
        selectedPolygonsInCheckbox={selectedPolygonsInCheckbox}
      />
    );
  }, [openModal, closeModal, t, handleDeletePolygons, sitePolygonData, selectedPolygonsInCheckbox]);
  const handleFixPolygons = useCallback(
    (selectedUUIDs: string[]) => {
      closeModal(ModalId.FIX_POLYGONS);
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Fix Polygons");
      clipPolygonList(selectedUUIDs);
      setPendingClipping(true);
    },
    [closeModal, setIsLoadingDelayedJob, setAlertTitle]
  );

  const openFormModalHandlerSubmitPolygon = useCallback(
    (selectedUUIDs: string[]) => {
      openModal(
        ModalId.FIX_POLYGONS,
        <ModalFixOverlaps
          title={t("Fix Polygons")}
          site={entityData}
          onClose={() => closeModal(ModalId.FIX_POLYGONS)}
          content={t(
            "The following polygons have one or more failed criteria, for which an automated solution may be applied. Click 'Fix Polygons' to correct the issue as a new version."
          )}
          primaryButtonText={t("Fix Polygons")}
          primaryButtonProps={{
            className: "px-8 py-3",
            variant: "primary",
            onClick: () => handleFixPolygons(selectedUUIDs)
          }}
          secondaryButtonText={t("Cancel")}
          secondaryButtonProps={{
            className: "px-8 py-3",
            variant: "white-page-admin",
            onClick: () => closeModal(ModalId.FIX_POLYGONS)
          }}
          selectedUUIDs={selectedUUIDs}
        />
      );
    },
    [openModal, closeModal, t, entityData, handleFixPolygons]
  );
  const runCheckPolygonsSelected = useCallback(
    async (selectedUUIDs: string[]) => {
      if (selectedUUIDs.length === 0) {
        return;
      }

      try {
        showLoader();
        await createPolygonValidation({
          polygonUuids: selectedUUIDs
        });

        ApiSlice.pruneCache("validations");
        refetchData();
        openNotification("success", t("Success!"), t("Polygons checked successfully"));
        hideLoader();
        setIsLoadingDelayedJob?.(false);
      } catch (error) {
        hideLoader();
        setIsLoadingDelayedJob?.(false);
        openNotification("error", t("Error!"), t("Failed to check polygons"));
      }
    },
    [refetchData, openNotification, t, hideLoader, showLoader, setIsLoadingDelayedJob]
  );

  const getSelectedPolygonUuids = useCallback((): string[] => {
    return sitePolygonData
      .filter(polygon => {
        const polygonUuid = polygon.polygonUuid ?? "";
        return selectedPolygonsInCheckbox.includes(polygonUuid);
      })
      .map(polygon => polygon.polygonUuid ?? "")
      .filter(uuid => uuid.length > 0);
  }, [sitePolygonData, selectedPolygonsInCheckbox]);

  const handleOpen = useCallback(
    (type: "check" | "fix" | "delete") => {
      if (type === "check") {
        const selectedUUIDs = getSelectedPolygonUuids();
        if (selectedUUIDs.length === 0) {
          return;
        }
        setIsLoadingDelayedJob?.(true);
        setAlertTitle?.("Check Polygons");
        runCheckPolygonsSelected(selectedUUIDs);
      } else if (type === "fix") {
        const selectedUUIDs = getSelectedPolygonUuids();
        if (selectedUUIDs.length === 0) {
          return;
        }
        openFormModalHandlerSubmitPolygon(selectedUUIDs);
      } else {
        openFormModalHandlerProcessBulkPolygons();
      }
    },
    [
      getSelectedPolygonUuids,
      setIsLoadingDelayedJob,
      setAlertTitle,
      runCheckPolygonsSelected,
      openFormModalHandlerSubmitPolygon,
      openFormModalHandlerProcessBulkPolygons
    ]
  );

  return (
    <div className="w-[320px] flex-col items-center gap-1 lg:w-[390px]">
      <div className="rounded-lg bg-[#ffffff26]  p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-bold" className="text-white">
          {t("Click below to process the selected polygons")}
        </Text>
        <When condition={selectedPolygonsInCheckbox.length > 0 && fixabilityResult.totalCount > 0}>
          <div className="mt-2 rounded bg-white bg-opacity-10 p-2">
            <Text variant="text-8-light" className="text-white">
              {fixabilityResult.canFixAny
                ? t("{count} of {total} selected polygons can be fixed", {
                    count: fixabilityResult.fixableCount,
                    total: fixabilityResult.totalCount
                  })
                : t("None of the selected polygons can be fixed")}
            </Text>
          </div>
        </When>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white
              disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleOpen("delete")}
            disabled={isLoadingDelayedJob}
          >
            {t("Delete")}
          </Button>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white
             disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleOpen("check")}
            disabled={isLoadingDelayedJob}
          >
            {t("Check")}
          </Button>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-primary
            disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleOpen("fix")}
            disabled={isLoadingDelayedJob}
            title={
              fixabilityResult.canFixAny
                ? getFixabilitySummaryMessage(fixabilityResult.fixableCount, fixabilityResult.totalCount, t)
                : t("No selected polygons can be fixed. Overlaps exceed the fixable limits (≤3.5% and ≤0.1 ha).")
            }
          >
            {t("Fix")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessBulkPolygonsControl;
