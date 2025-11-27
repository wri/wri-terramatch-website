import { useT } from "@transifex/react";
import { useCallback, useEffect, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalFixOverlaps from "@/components/extensive/Modal/ModalFixOverlaps";
import ModalProcessBulkPolygons from "@/components/extensive/Modal/ModalProcessBulkPolygons";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { clipPolygonList } from "@/connections/PolygonClipping";
import { useAllSiteValidations } from "@/connections/Validation";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useDeleteV2TerrafundProjectPolygons, usePostV2TerrafundValidationPolygons } from "@/generated/apiComponents";
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
  const { mutate: checkPolygons } = usePostV2TerrafundValidationPolygons();
  const {
    selectedPolygonsInCheckbox,
    setSelectedPolygonsInCheckbox,
    setShouldRefetchPolygonData,
    setShouldRefetchValidation
  } = useMapAreaContext();
  const refetchData = useCallback(() => {
    context?.reloadSiteData();
    setShouldRefetchValidation(true);
    setShouldRefetchPolygonData(true);
    setSelectedPolygonsInCheckbox([]);
  }, [context, setShouldRefetchValidation, setShouldRefetchPolygonData, setSelectedPolygonsInCheckbox]);
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const [, { delayedJobs }] = useDelayedJobs();
  const [pendingClipping, setPendingClipping] = useState(false);
  const sitePolygonData = context?.sitePolygonData as Array<SitePolygonLightDto>;
  const { mutate: deletePolygons } = useDeleteV2TerrafundProjectPolygons();

  const [fixabilityResult, setFixabilityResult] = useState<{
    fixableCount: number;
    totalCount: number;
    canFixAny: boolean;
  }>({ fixableCount: 0, totalCount: 0, canFixAny: false });

  const { allValidations: overlapValidations } = useAllSiteValidations(entityData?.uuid ?? "", OVERLAPPING_CRITERIA_ID);

  useEffect(() => {
    if (!(pendingClipping && delayedJobs && delayedJobs.length > 0)) {
      return;
    }

    const completedClippingJob = delayedJobs.find(job => {
      const isCompleted = job.status === "succeeded" || job.status === "failed";
      const isPolygonClipping = job.name === "Polygon Clipping";
      return isCompleted && isPolygonClipping;
    });

    if (completedClippingJob) {
      if (completedClippingJob.status === "succeeded") {
        const clippedData = completedClippingJob.payload?.data;
        let polygonNames = "";

        if (Array.isArray(clippedData) && clippedData.length > 0) {
          polygonNames = clippedData
            .map((item: any) => item.attributes?.polyName)
            .filter(Boolean)
            .join(", ");
        } else if (clippedData && typeof clippedData === "object" && clippedData.attributes?.polyName) {
          polygonNames = clippedData.attributes.polyName;
        }

        setIsLoadingDelayedJob?.(false);
        if (polygonNames) {
          openNotification("success", t("Success!"), t(`Polygons fixed successfully. Fixed: ${polygonNames}`));
        } else {
          openNotification("warning", t("Warning"), t("No polygons were fixed."));
        }
        ApiSlice.pruneCache("validations");

        refetchData?.();
      } else {
        hideLoader();
        setIsLoadingDelayedJob?.(false);
        openNotification("error", t("Error!"), t("Failed to fix polygons"));
      }

      setPendingClipping(false);
    }
  }, [
    delayedJobs,
    pendingClipping,
    setIsLoadingDelayedJob,
    openNotification,
    t,
    refetchData,
    hideLoader,
    sitePolygonData
  ]);

  useEffect(() => {
    if (selectedPolygonsInCheckbox.length > 0 && overlapValidations.length > 0) {
      const selectedPolygonsWithOverlaps = overlapValidations
        .filter(validation => selectedPolygonsInCheckbox.includes(validation.polygonUuid ?? ""))
        .map(validation => {
          const overlapCriteria = validation.criteriaList.find(
            criteria => criteria.criteriaId === OVERLAPPING_CRITERIA_ID
          );
          return {
            extra_info: overlapCriteria?.extraInfo
          };
        });

      if (selectedPolygonsWithOverlaps.length > 0) {
        const result = checkPolygonsFixability(selectedPolygonsWithOverlaps);
        setFixabilityResult({
          fixableCount: result.fixableCount,
          totalCount: result.totalCount,
          canFixAny: result.fixableCount > 0
        });
      } else {
        setFixabilityResult({ fixableCount: 0, totalCount: 0, canFixAny: false });
      }
    } else {
      setFixabilityResult({ fixableCount: 0, totalCount: 0, canFixAny: false });
    }
  }, [selectedPolygonsInCheckbox, overlapValidations]);

  const openFormModalHandlerProcessBulkPolygons = () => {
    openModal(
      ModalId.DELETE_BULK_POLYGONS,
      <ModalProcessBulkPolygons
        title={t("Delete Polygons")}
        onClose={() => closeModal(ModalId.DELETE_BULK_POLYGONS)}
        content={t("Confirm that the following polygons will be deleted. This operation is not reversible.")}
        primaryButtonText={t("Delete")}
        onClick={(currentSelectedUuids: any) => {
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
        }}
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
  };
  const openFormModalHandlerSubmitPolygon = (selectedUUIDs: string[]) => {
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
          onClick: () => {
            closeModal(ModalId.FIX_POLYGONS);
            setIsLoadingDelayedJob?.(true);
            setAlertTitle?.("Fix Polygons");
            clipPolygonList(selectedUUIDs);
            setPendingClipping(true);
          }
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
  };
  const runCheckPolygonsSelected = (selectedUUIDs: string[]) => {
    checkPolygons(
      {
        body: {
          uuids: selectedUUIDs,
          entity_uuid: entityData?.uuid,
          entity_type: "sites"
        }
      },
      {
        onSuccess: () => {
          refetchData?.();
          openNotification("success", t("Success!"), t("Polygons checked successfully"));
          hideLoader();
          setIsLoadingDelayedJob?.(false);
        },
        onError: () => {
          hideLoader();
          setIsLoadingDelayedJob?.(false);
          openNotification("error", t("Error!"), t("Failed to check polygons"));
        }
      }
    );
  };

  const handleOpen = (type: "check" | "fix" | "delete") => {
    const initialSelection = sitePolygonData.map((polygon: any) =>
      selectedPolygonsInCheckbox.includes(polygon.polygonUuid)
    );
    const selectedUUIDs: string[] = sitePolygonData
      .filter((_, index) => initialSelection[index])
      .map((polygon: SitePolygonLightDto) => polygon.polygonUuid ?? "");
    if (type === "check") {
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Check Polygons");
      runCheckPolygonsSelected(selectedUUIDs);
    } else if (type === "fix") {
      openFormModalHandlerSubmitPolygon(selectedUUIDs);
    } else {
      openFormModalHandlerProcessBulkPolygons();
    }
  };

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
