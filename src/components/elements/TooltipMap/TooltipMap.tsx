import { useT } from "@transifex/react";
import { useMemo } from "react";

import { findSitePolygonByMapFeatureUuid } from "@/components/elements/Map-mapbox/sitePolygonMapLookup";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { TooltipType } from "../Map-mapbox/Map.d";
import { formatPlannedStartDate } from "../Map-mapbox/utils";
import Text from "../Text/Text";

const EMPTY_SITE_POLYGON_LIST: SitePolygonLightDto[] = [];

export interface TooltipMapProps {
  setTooltipOpen: () => void;
  setEditPolygon: (value?: string) => void;
  polygonUuid: string;
  sitePolygonData?: SitePolygonLightDto[];
  type?: TooltipType;
  popup?: unknown;
}

const topBorderColorPopup: Record<SitePolygonLightDto["status"], string> = {
  submitted: "border-t-primary",
  approved: "border-t-[#72D961]",
  "needs-more-information": "border-t-[#FF8938]",
  draft: "border-t-[#E468EF]"
};

const TooltipMap = (props: TooltipMapProps) => {
  const { setTooltipOpen, setEditPolygon, polygonUuid, sitePolygonData, type } = props;
  const t = useT();

  const sitePolygonsStable = sitePolygonData ?? EMPTY_SITE_POLYGON_LIST;

  const polygonData = useMemo(
    () => findSitePolygonByMapFeatureUuid(sitePolygonsStable, polygonUuid),
    [sitePolygonsStable, polygonUuid]
  );

  const formatArrayField = (arr: string[] | null | undefined): string => {
    if (arr == null || arr.length === 0) {
      return t("Unknown");
    }
    return arr.join(", ");
  };

  const formatDate = (date: string | null | undefined): string => {
    if (date == null) {
      return "";
    }
    const plantStartDate = new Date(date);
    return formatPlannedStartDate(plantStartDate);
  };

  const polygonDataStatus = polygonData?.status ?? "draft";

  const goToRelatedSiteProfile = (): void => {
    if (polygonData?.siteId == null) {
      return;
    }
    const siteUrl = `/site/${polygonData.siteId}`;
    window.open(siteUrl, "_blank");
  };

  return (
    <div
      className={`w-[295px] rounded border-t-[5px] ${topBorderColorPopup[polygonDataStatus]} bg-white px-3 pb-3 pt-[7px]`}
    >
      <button onClick={setTooltipOpen} className="absolute right-2 top-2 ml-2 rounded p-1 hover:bg-grey-800">
        <Icon name={IconNames.CLEAR} className="h-3 w-3 text-darkCustom-100" />
      </button>

      <div className="text-10 flex items-center justify-center gap-1">
        <Text variant="text-10" className="mb-1 px-3 text-center uppercase leading-[normal]">
          {t("SITE : ")}
          {polygonData?.siteName ?? ""}
        </Text>
      </div>
      <Text variant="text-10-bold" className="text-center leading-[normal] text-black">
        {polygonData?.name != null && polygonData.name !== "" ? polygonData.name : t("Unnamed Polygon")}
      </Text>
      <hr className="my-2 border border-grey-750" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            {t("Restoration Practice")}
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black ">
            {formatArrayField(polygonData?.practice)}
          </Text>
        </div>
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            {t("Target Land Use System")}
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black ">
            {polygonData?.targetSys != null ? polygonData.targetSys : t("Unknown")}
          </Text>
        </div>
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            {t("Tree Distribution")}
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black">
            {formatArrayField(polygonData?.distr)}
          </Text>
        </div>
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            {t("Planting Start Date")}
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black ">
            {formatDate(polygonData?.plantStart)}
          </Text>
        </div>
      </div>

      <hr className="my-2 border border-grey-750" />
      {type === "edit" && (
        <div className="flex w-full items-center justify-center">
          <button
            className="flex items-center justify-center gap-1"
            onClick={() => {
              if (polygonData?.primaryUuid != null) {
                setEditPolygon(polygonData.primaryUuid);
              }
            }}
          >
            <Icon name={IconNames.CLICK} className="h-4 w-4" />
            <Text variant="text-10-light" className="italic text-black">
              {t("Click to edit polygon")}
            </Text>
          </button>
        </div>
      )}
      {type === "goTo" && (
        <div className="flex w-full items-center justify-center">
          <button className="flex items-center justify-center gap-1" onClick={() => goToRelatedSiteProfile()}>
            <Icon name={IconNames.CLICK} className="h-4 w-4" />
            <Text variant="text-10-light" className="italic text-black">
              {t("click to open site profile page")}
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};

export default TooltipMap;
