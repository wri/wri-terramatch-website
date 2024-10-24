import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  usePostV2TerrafundClipPolygonsPolygonUuid,
  usePostV2TerrafundValidationPolygon
} from "@/generated/apiComponents";
import { ClippedPolygonResponse, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import Log from "@/utils/log";

import Button from "../../Button/Button";

const CheckIndividualPolygonControl = ({ viewRequestSuport }: { viewRequestSuport: boolean }) => {
  const [clickedValidation, setClickedValidation] = useState(false);
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

  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    openNotification(type, title, message);
  };
  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: () => {
      setShouldRefetchValidation(true);
      setClickedValidation(false);
      hideLoader();
      displayNotification(
        t("Please update and re-run if validations fail."),
        "success",
        t("Success! TerraMatch reviewed the polygon")
      );
    },
    onError: () => {
      hideLoader();
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  });

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

  useEffect(() => {
    if (clickedValidation) {
      showLoader();
      getValidations({ queryParams: { uuid: editPolygon.uuid } });
    }
  }, [clickedValidation]);

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
        <Button
          variant="text"
          className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-black"
          onClick={() => {
            showLoader();
            clipPolygons({ pathParams: { uuid: editPolygon.uuid } });
          }}
        >
          {t("Fix Polygon")}
        </Button>
      </When>
    </div>
  );
};

export default CheckIndividualPolygonControl;
