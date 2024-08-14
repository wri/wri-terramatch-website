import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import {
  COMPLETED_DATA_CRITERIA_ID,
  ESTIMATED_AREA_CRITERIA_ID
} from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useGetV2TerrafundValidationSite, usePostV2TerrafundValidationSitePolygons } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

export interface CheckSitePolygonProps {
  siteRecord?: {
    uuid: string;
  };
  polygonCheck: boolean;
}

interface CheckedPolygon {
  uuid: string;
  valid: boolean;
  checked: boolean;
  nonValidCriteria: Record<string, any>[];
}

interface TransformedData {
  id: number;
  valid: boolean;
  checked: boolean;
  label: string | null;
}

const CheckPolygonControl = (props: CheckSitePolygonProps) => {
  const { siteRecord, polygonCheck } = props;
  const siteUuid = siteRecord?.uuid;
  const [openCollapse, setOpenCollapse] = useState(false);
  const [sitePolygonCheckData, setSitePolygonCheckData] = useState<TransformedData[]>([]);
  const [clickedValidation, setClickedValidation] = useState(false);
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const { showLoader, hideLoader } = useLoading();
  const { setShouldRefetchValidation } = useMapAreaContext();
  const t = useT();
  const { openNotification } = useNotificationContext();
  const { data: currentValidationSite, refetch: reloadSitePolygonValidation } = useGetV2TerrafundValidationSite<
    CheckedPolygon[]
  >(
    {
      queryParams: {
        uuid: siteUuid ?? ""
      }
    },
    {
      enabled: !!siteUuid
    }
  );
  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    openNotification(type, title, message);
  };

  const { mutate: getValidations } = usePostV2TerrafundValidationSitePolygons({
    onSuccess: () => {
      reloadSitePolygonValidation();
      setClickedValidation(false);
      hideLoader();
      setShouldRefetchValidation(true);
      displayNotification(
        t("Please update and re-run if any polygons fail."),
        "success",
        t("Success! TerraMatch reviewed all polygons")
      );
    },
    onError: () => {
      hideLoader();
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  });

  const getTransformedData = (currentValidationSite: CheckedPolygon[]) => {
    return currentValidationSite.map((checkedPolygon, index) => {
      const matchingPolygon = Array.isArray(sitePolygonData)
        ? sitePolygonData.find((polygon: SitePolygon) => polygon.poly_id === checkedPolygon.uuid)
        : null;
      const excludedFromValidationCriterias = [COMPLETED_DATA_CRITERIA_ID, ESTIMATED_AREA_CRITERIA_ID];
      const nonValidCriteriasIds = checkedPolygon?.nonValidCriteria?.map(r => r.criteria_id);
      const failingCriterias = nonValidCriteriasIds?.filter(r => !excludedFromValidationCriterias.includes(r));
      let isValid = false;
      if (checkedPolygon?.nonValidCriteria?.length === 0) {
        isValid = true;
      } else if (failingCriterias?.length === 0) {
        isValid = true;
      }
      return {
        id: index + 1,
        valid: checkedPolygon.checked && isValid,
        checked: checkedPolygon.checked,
        label: matchingPolygon?.poly_name ?? null
      };
    });
  };

  useEffect(() => {
    if (currentValidationSite) {
      const transformedData = getTransformedData(currentValidationSite);
      setSitePolygonCheckData(transformedData);
    }
  }, [currentValidationSite, sitePolygonData]);

  useEffect(() => {
    if (sitePolygonData) {
      reloadSitePolygonValidation();
    }
  }, [sitePolygonData]);

  useEffect(() => {
    if (clickedValidation) {
      showLoader();
      getValidations({ queryParams: { uuid: siteUuid ?? "" } });
    }
  }, [clickedValidation]);

  return (
    <div className="grid gap-2">
      <div className="rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
          onClick={() => {
            setClickedValidation(true);
            setOpenCollapse(true);
          }}
        >
          {polygonCheck ? t("Check Polygons") : t("Check All Polygons")}
        </Button>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-primary"
          onClick={() => {}}
        >
          {t("Fix Polygons")}
        </Button>
      </div>
      <When condition={polygonCheck}>
        <div className="relative flex max-h-[300px] w-[231px] flex-col gap-2 rounded-xl p-3">
          <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-xl bg-[#FFFFFF33] backdrop-blur-md" />
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
              {sitePolygonCheckData.map(polygon => (
                <div key={polygon.id} className="flex items-start gap-2">
                  <div>
                    <Icon
                      name={polygon.valid ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS}
                      className="h-4 w-4"
                    />
                  </div>
                  <Text variant="text-10-light" className="mt-[2px] w-fit-content leading-tight text-white lg:mt-0">
                    {`${polygon.label ?? t("Unnamed Polygon")} ${polygon.checked ? "" : t("(not checked yet)")}`}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </When>
    </div>
  );
};

export default CheckPolygonControl;
