import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { fetchPostV2TerrafundValidationSitePolygons, useGetV2TerrafundValidationSite } from "@/generated/apiComponents";
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
  const t = useT();
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

  const validatePolygons = async () => {
    await fetchPostV2TerrafundValidationSitePolygons({ queryParams: { uuid: siteUuid ?? "" } });
    reloadSitePolygonValidation();
    setClickedValidation(false);
  };

  const getTransformedData = (currentValidationSite: CheckedPolygon[]) => {
    return currentValidationSite.map((checkedPolygon, index) => {
      const matchingPolygon = Array.isArray(sitePolygonData)
        ? sitePolygonData.find((polygon: SitePolygon) => polygon.poly_id === checkedPolygon.uuid)
        : null;
      return {
        id: index + 1,
        valid: checkedPolygon.valid,
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
      validatePolygons();
    }
  }, [clickedValidation]);

  return (
    <div className="grid gap-2">
      <div className="rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-light">{t("Your polygons have been updated")}</Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
          onClick={() => setClickedValidation(true)}
        >
          {t("Check Polygons")}
        </Button>
      </div>
      <When condition={polygonCheck}>
        <div className="relative flex w-[231px] flex-col gap-2 rounded-xl p-3">
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
          {openCollapse &&
            sitePolygonCheckData.map(polygon => (
              <div key={polygon.id} className="flex items-center gap-2">
                <Icon
                  name={polygon.valid ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS}
                  className="h-4 w-4"
                />
                <Text variant="text-10-light" className="text-white">
                  {`${polygon.label ?? "Unnamed Polygon"} ${polygon.checked ? "" : "(not checked yet)"}`}
                </Text>
              </div>
            ))}
        </div>
      </When>
    </div>
  );
};

export default CheckPolygonControl;
