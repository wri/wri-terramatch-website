import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import Tooltip from "@/components/elements/Tooltip/Tooltip";
import { clipSinglePolygon } from "@/connections/PolygonClipping";
import { useListPolygonVersions } from "@/connections/PolygonVersion";
import { createPolygonValidation, usePolygonValidation } from "@/connections/Validation";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { parseV3ValidationData } from "@/helpers/polygonValidation";
import { usePolygonClippingCompletion } from "@/hooks/usePolygonClippingCompletion";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonFixability, PolygonFixabilityResult } from "@/utils/polygonFixValidation";

import Button from "../../Button/Button";

const CheckIndividualPolygonControl = ({
  viewRequestSuport,
  entityData
}: {
  viewRequestSuport: boolean;
  entityData?: any;
}) => {
  const [clickedValidation, setClickedValidation] = useState(false);
  const [canBeFixed, setCanBeFixed] = useState(false);
  const [fixabilityResult, setFixabilityResult] = useState<PolygonFixabilityResult | null>(null);
  const [pendingClipping, setPendingClipping] = useState(false);
  const {
    editPolygon,
    setEditPolygon,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    setShouldRefetchPolygonVersions,
    hasOverlaps
  } = useMapAreaContext();
  const t = useT();
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();

  const v3ValidationData = usePolygonValidation({
    polygonUuid: editPolygon?.uuid || ""
  });

  const connectionProps = useMemo(
    () => ({
      uuid: editPolygon?.primary_uuid ?? undefined,
      enabled: !!editPolygon?.primary_uuid
    }),
    [editPolygon?.primary_uuid]
  );

  const [, { data: polygonVersionsData, refetch: refetchPolygonVersionsHook }] =
    useListPolygonVersions(connectionProps);

  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    openNotification(type, title, message);
  };

  const runPolygonValidation = async () => {
    try {
      showLoader();
      const polygonUuid = editPolygon?.uuid ?? "";
      await createPolygonValidation({
        polygonUuids: [polygonUuid]
      });

      setShouldRefetchValidation(true);
      setClickedValidation(false);
      ApiSlice.pruneCache("validations");

      hideLoader();
      displayNotification(
        t("Please update and re-run if validations fail."),
        "success",
        t("Success! TerraMatch reviewed the polygon")
      );
    } catch (error) {
      hideLoader();
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  };

  usePolygonClippingCompletion({
    pendingClipping,
    setPendingClipping,
    onSuccess: async completedClippingJob => {
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

      if (polygonNames) {
        openNotification("success", t("Success! The following polygons have been fixed:"), polygonNames);
      } else {
        openNotification("warning", t("No polygon have been fixed"), t("Please run 'Check Polygons' again."));
      }

      setShouldRefetchPolygonData(true);
      setShouldRefetchValidation(true);
      setShouldRefetchPolygonVersions(true);

      ApiSlice.pruneCache("validations");
      ApiSlice.pruneIndex("sitePolygons", "");

      await refetchPolygonVersionsHook();

      const polygonActive = polygonVersionsData?.find(item => item.isActive);

      setEditPolygon({
        isOpen: true,
        uuid: polygonActive?.polygonUuid as string,
        primary_uuid: polygonActive?.primaryUuid!
      });
      hideLoader();
    },
    onFailure: () => {
      openNotification("error", t("Error! Could not fix polygons"), t("Please try again later."));
      hideLoader();
    }
  });

  useValueChanged(clickedValidation, () => {
    if (clickedValidation) {
      runPolygonValidation();
    }
  });

  useEffect(() => {
    if (v3ValidationData?.criteriaList && v3ValidationData.criteriaList.length > 0) {
      const processedMenu = parseV3ValidationData(v3ValidationData);

      const hasOverlapsInData = processedMenu.some(item => Number(item.id) === OVERLAPPING_CRITERIA_ID && !item.status);

      if (hasOverlapsInData) {
        const overlapCriteria = processedMenu.find(item => Number(item.id) === OVERLAPPING_CRITERIA_ID && !item.status);

        if (overlapCriteria && overlapCriteria.extra_info && Array.isArray(overlapCriteria.extra_info)) {
          const result = checkPolygonFixability(overlapCriteria.extra_info);
          setFixabilityResult(result);
          setCanBeFixed(result.canBeFixed);
        } else {
          setFixabilityResult(null);
          setCanBeFixed(false);
        }
      } else {
        setFixabilityResult(null);
        setCanBeFixed(false);
      }
    } else {
      setFixabilityResult(null);
      setCanBeFixed(false);
    }
  }, [v3ValidationData]);

  return (
    <div className="flex gap-2">
      <When condition={viewRequestSuport}>
        <Button
          variant="text"
          className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-white bg-white p-2 text-black hover:border-black"
          onClick={() => setClickedValidation(true)}
        >
          {t("Request Support")}
        </Button>
      </When>
      <Button
        variant="text"
        className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 text-white hover:border-white"
        onClick={() => setClickedValidation(true)}
      >
        {t("Check Polygon")}
      </Button>
      <When condition={hasOverlaps}>
        <Tooltip
          content={
            fixabilityResult != null
              ? fixabilityResult.canBeFixed
                ? t("✓ This polygon can be fixed automatically - meets all criteria (≤3.5% overlap, ≤0.1 ha area)")
                : `✗ Cannot be fixed: ${fixabilityResult.reasons.join(". ")}`
              : t("Checking fixability...")
          }
          placement="top"
          width="max-w-xs"
          colorBackground="black"
        >
          <div className="relative flex items-center">
            <Button
              variant="text"
              className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => {
                showLoader();
                clipSinglePolygon(editPolygon.uuid);
                setPendingClipping(true);
              }}
              disabled={!canBeFixed}
            >
              {t("Fix Polygon")}
            </Button>
          </div>
        </Tooltip>
      </When>
    </div>
  );
};

export default CheckIndividualPolygonControl;
