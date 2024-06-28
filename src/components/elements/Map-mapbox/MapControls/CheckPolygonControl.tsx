import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useGetV2TerrafundValidationSite, usePostV2TerrafundValidationSitePolygons } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

import Button from "../../Button/Button";
import Notification from "../../Notification/Notification";
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
  const [notificationStatus, setNotificationStatus] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }>({
    open: false,
    message: "",
    type: "success",
    title: "Success!"
  });
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
    setNotificationStatus({
      open: true,
      message,
      type,
      title
    });
    setTimeout(() => {
      setNotificationStatus({
        open: false,
        message: "",
        type: "success",
        title: ""
      });
    }, 3000);
  };

  const { mutate: getValidations } = usePostV2TerrafundValidationSitePolygons({
    onSuccess: () => {
      reloadSitePolygonValidation();
      setClickedValidation(false);
      displayNotification(
        t("Please update and re-run if any polygons fail."),
        "success",
        "Success! TerraMatch reviewed all polygons"
      );
    },
    onError: () => {
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", "Error! TerraMatch could not review polygons");
    }
  });

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
      getValidations({ queryParams: { uuid: siteUuid ?? "" } });
    }
  }, [clickedValidation]);

  return (
    <div className="grid gap-2">
      <Notification {...notificationStatus} />
      <div className="rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
          onClick={() => {
            console.log("Clcededede ", true);
            setClickedValidation(true);
          }}
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
                  {`${polygon.label ?? t("Unnamed Polygon")} ${polygon.checked ? "" : t("(not checked yet)")}`}
                </Text>
              </div>
            ))}
        </div>
      </When>
    </div>
  );
};

export default CheckPolygonControl;
