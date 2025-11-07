import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Tooltip from "@/components/elements/Tooltip/Tooltip";
import { createPolygonValidation, usePolygonValidation } from "@/connections/Validation";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  usePostV2TerrafundClipPolygonsPolygonUuid
} from "@/generated/apiComponents";
import { ClippedPolygonResponse, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { parseV3ValidationData } from "@/helpers/polygonValidation";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import Log from "@/utils/log";
import { checkPolygonFixability, PolygonFixabilityResult } from "@/utils/polygonFixValidation";

import Button from "../../Button/Button";

const CheckIndividualPolygonControl = ({ viewRequestSuport }: { viewRequestSuport: boolean }) => {
  const [clickedValidation, setClickedValidation] = useState(false);
  const [canBeFixed, setCanBeFixed] = useState(false);
  const [fixabilityResult, setFixabilityResult] = useState<PolygonFixabilityResult | null>(null);
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
      if (editPolygon?.uuid != null) {
        ApiSlice.pruneCache("validations", [editPolygon.uuid]);
      }
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

  const { mutate: clipPolygons } = usePostV2TerrafundClipPolygonsPolygonUuid({
    onSuccess: async (data: ClippedPolygonResponse) => {
      if (!data.updated_polygons?.length) {
        openNotification("warning", t("No polygon have been fixed"), t("Please run 'Check Polygons' again."));
        hideLoader();
        return;
      }
      const updatedPolygonNames = data.updated_polygons
        ?.map(p => p.poly_name)
        .filter(Boolean)
        .join(", ");
      openNotification("success", t("Success! The following polygons have been fixed:"), updatedPolygonNames);
      setShouldRefetchPolygonData(true);
      setShouldRefetchValidation(true);
      setShouldRefetchPolygonVersions(true);
      if (editPolygon?.uuid != null) {
        ApiSlice.pruneCache("validations", [editPolygon.uuid]);
      }

      const polygonVersionData = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: editPolygon?.primary_uuid as string }
      })) as SitePolygonsDataResponse;
      const polygonActive = polygonVersionData?.find(item => item.is_active);
      setEditPolygon({
        isOpen: true,
        uuid: polygonActive?.poly_id as string,
        primary_uuid: polygonActive?.primary_uuid
      });
      hideLoader();
    },
    onError: error => {
      Log.error("Error clipping polygons:", error);
      openNotification("error", t("Error! Could not fix polygons"), t("Please try again later."));
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
                clipPolygons({ pathParams: { uuid: editPolygon.uuid } });
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
