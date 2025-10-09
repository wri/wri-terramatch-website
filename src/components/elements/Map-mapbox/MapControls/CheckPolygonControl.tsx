import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalFixOverlaps from "@/components/extensive/Modal/ModalFixOverlaps";
import { useAllSiteValidations } from "@/connections/Validation";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  usePostV2TerrafundClipPolygonsSiteUuid,
  usePostV2TerrafundValidationSitePolygons
} from "@/generated/apiComponents";
import { ClippedPolygonResponse } from "@/generated/apiSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import JobsSlice from "@/store/jobsSlice";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import Log from "@/utils/log";
import { checkPolygonsFixability, getFixabilitySummaryMessage } from "@/utils/polygonFixValidation";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

export interface CheckSitePolygonProps {
  siteRecord?: {
    uuid: string;
  };
  polygonCheck: boolean;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
}

const CheckPolygonControl = (props: CheckSitePolygonProps) => {
  const { siteRecord, polygonCheck, setIsLoadingDelayedJob, isLoadingDelayedJob, setAlertTitle } = props;
  const siteUuid = siteRecord?.uuid;
  const [openCollapse, setOpenCollapse] = useState(false);
  const [clickedValidation, setClickedValidation] = useState(false);
  const [hasOverlaps, setHasOverlaps] = useState(false);
  const [fixabilityResult, setFixabilityResult] = useState<{
    fixableCount: number;
    totalCount: number;
    canFixAny: boolean;
  }>({ fixableCount: 0, totalCount: 0, canFixAny: false });
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const sitePolygonRefresh = context?.reloadSiteData;
  const { hideLoader } = useLoading();
  const { setShouldRefetchValidation, setShouldRefetchPolygonData, setSelectedPolygonsInCheckbox } =
    useMapAreaContext();
  const { openModal, closeModal } = useModalContext();
  const t = useT();
  const { openNotification } = useNotificationContext();

  const { allValidations: overlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(siteUuid ?? "", OVERLAPPING_CRITERIA_ID);
  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    openNotification(type, title, message);
  };

  const { mutate: getValidations } = usePostV2TerrafundValidationSitePolygons({
    onSuccess: () => {
      fetchOverlapValidations(true);
      setClickedValidation(false);
      hideLoader();
      setShouldRefetchValidation(true);
      if (Array.isArray(sitePolygonData)) {
        const polygonUuids = sitePolygonData
          .map(polygon => polygon.polygonUuid)
          .filter((uuid): uuid is string => Boolean(uuid));
        if (polygonUuids.length > 0) {
          ApiSlice.pruneCache("validations", polygonUuids);
        }
      }
      displayNotification(
        t("Please update and re-run if any polygons fail."),
        "success",
        t("Success! TerraMatch reviewed all polygons")
      );
      setIsLoadingDelayedJob?.(false);
      JobsSlice.reset();
    },
    onError: () => {
      hideLoader();
      setIsLoadingDelayedJob?.(false);
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  });

  const { mutate: clipPolygons } = usePostV2TerrafundClipPolygonsSiteUuid({
    onSuccess: (data: ClippedPolygonResponse) => {
      if (!data.updated_polygons?.length) {
        openNotification("warning", t("No polygon have been fixed"), t("Please run 'Check Polygons' again."));
        hideLoader();
        setIsLoadingDelayedJob?.(false);
        closeModal(ModalId.FIX_POLYGONS);
        return;
      }
      if (data) {
        sitePolygonRefresh?.();
        setShouldRefetchPolygonData(true);
        setShouldRefetchValidation(true);
        if (Array.isArray(sitePolygonData)) {
          const polygonUuids = sitePolygonData
            .map(polygon => polygon.polygonUuid)
            .filter((uuid): uuid is string => Boolean(uuid));
          if (polygonUuids.length > 0) {
            ApiSlice.pruneCache("validations", polygonUuids);
          }
        }
        const updatedPolygonNames = data.updated_polygons
          ?.map(p => p.poly_name)
          .filter(Boolean)
          .join(", ");
        openNotification("success", t("Success! The following polygons have been fixed:"), updatedPolygonNames);
        hideLoader();
        setIsLoadingDelayedJob?.(false);
      }
      closeModal(ModalId.FIX_POLYGONS);
    },
    onError: error => {
      Log.error("Error clipping polygons:", error);
      displayNotification(t("An error occurred while fixing polygons. Please try again."), "error", t("Error"));
      hideLoader();
      setIsLoadingDelayedJob?.(false);
    }
  });

  const runFixPolygonOverlaps = () => {
    if (siteUuid) {
      closeModal(ModalId.FIX_POLYGONS);
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Fix Polygons");
      clipPolygons({ pathParams: { uuid: siteUuid } });
    } else {
      displayNotification(t("Cannot fix polygons: Site UUID is missing."), "error", t("Error"));
    }
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      ModalId.FIX_POLYGONS,
      <ModalFixOverlaps
        title="Fix Polygons"
        site={siteRecord}
        onClose={() => closeModal(ModalId.FIX_POLYGONS)}
        content="The following polygons have one or more failed criteria, for which an automated solution may be applied. Click 'Fix Polygons' to correct the issue as a new version."
        primaryButtonText="Fix Polygons"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            runFixPolygonOverlaps();
          }
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.FIX_POLYGONS)
        }}
      />
    );
  };

  useEffect(() => {
    setHasOverlaps(overlapValidations.length > 0);

    if (overlapValidations.length > 0) {
      const polygonsWithOverlaps = overlapValidations.map(validation => {
        const overlapCriteria = validation.criteriaList.find(
          criteria => criteria.criteriaId === OVERLAPPING_CRITERIA_ID
        );
        return {
          extra_info: overlapCriteria?.extraInfo
        };
      });

      const result = checkPolygonsFixability(polygonsWithOverlaps);
      setFixabilityResult({
        fixableCount: result.fixableCount,
        totalCount: result.totalCount,
        canFixAny: result.fixableCount > 0
      });
    } else {
      setFixabilityResult({ fixableCount: 0, totalCount: 0, canFixAny: false });
    }
  }, [overlapValidations]);

  useValueChanged(sitePolygonData, () => {
    if (sitePolygonData && siteUuid != null) {
      fetchOverlapValidations();
    }
  });

  useValueChanged(clickedValidation, () => {
    if (clickedValidation) {
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Check Polygons");
      getValidations({ queryParams: { uuid: siteUuid ?? "" } });
    }
  });

  return (
    <div className="grid gap-2">
      <div className="rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white
          disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => {
            setClickedValidation(true);
            setOpenCollapse(true);
            setSelectedPolygonsInCheckbox([]);
          }}
          disabled={isLoadingDelayedJob}
        >
          {polygonCheck ? t("Check Polygons") : t("Check All Polygons")}
        </Button>
        <When condition={hasOverlaps}>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-primary
             disabled:cursor-not-allowed disabled:opacity-60"
            onClick={openFormModalHandlerSubmitPolygon}
            disabled={isLoadingDelayedJob}
            title={
              fixabilityResult.canFixAny
                ? getFixabilitySummaryMessage(fixabilityResult.fixableCount, fixabilityResult.totalCount, t)
                : t("No polygons can be fixed. Overlaps exceed the fixable limits (≤3.5% and ≤0.1 ha).")
            }
          >
            {t("Fix Polygons")}
          </Button>
        </When>
      </div>
      <When condition={polygonCheck}>
        <div className="relative flex max-h-[300px] w-[231px] flex-col gap-2 rounded-xl p-3">
          <div className="absolute left-0 top-0 -z-10 h-full w-full rounded-xl bg-[#FFFFFF33] backdrop-blur-md" />
          <button
            onClick={() => {
              setOpenCollapse(!openCollapse);
            }}
            className="flex items-center justify-between"
          >
            <Text variant="text-10-bold" className="text-white">
              {t("Polygon Checks")}
            </Text>
            <Icon
              name={IconNames.CHEVRON_DOWN}
              className={classNames(
                "h-4 w-4 text-white duration-300",
                openCollapse ? "rotate-180 transform" : "rotate-0 transform"
              )}
            />
          </button>
          {openCollapse && (
            <div className="flex min-h-0 grow flex-col gap-2 overflow-auto">
              <Text variant="text-10-light" className="text-white">
                {hasOverlaps
                  ? fixabilityResult.canFixAny
                    ? getFixabilitySummaryMessage(fixabilityResult.fixableCount, fixabilityResult.totalCount, t)
                    : t(
                        "Overlapping polygons detected but cannot be fixed. Overlaps exceed the fixable limits (≤3.5% and ≤0.1 ha)."
                      )
                  : t("No overlapping polygons found.")}
              </Text>
              <When condition={hasOverlaps && fixabilityResult.totalCount > 0}>
                <div className="rounded bg-white bg-opacity-10 p-2">
                  <Text variant="text-8-light" className="text-white">
                    {t("Fixable criteria: ≤3.5% overlap AND ≤0.1 ha area")}
                  </Text>
                </div>
              </When>
            </div>
          )}
        </div>
      </When>
    </div>
  );
};

export default CheckPolygonControl;
