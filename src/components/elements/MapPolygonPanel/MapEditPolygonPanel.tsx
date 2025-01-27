import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygon, SitePolygonsDataResponse, V2TerrafundCriteriaData } from "@/generated/apiSchemas";

import Button from "../Button/Button";
import Text from "../Text/Text";
import AttributeInformation from "./AttributeInformation";
import ChecklistInformation from "./ChecklistInformation";
import VersionInformation from "./VersionInformation";

export interface MapEditPolygonPanelProps {
  tabEditPolygon: string;
  setTabEditPolygon: Dispatch<SetStateAction<string>>;
  polygonVersionData?: SitePolygonsDataResponse;
  refetchPolygonVersions?: () => void;
  refreshEntity?: () => void;
  mapFunctions?: any;
  polygonData?: Record<string, string[]>;
  recallEntityData?: () => void;
}

const MapEditPolygonPanel = ({
  tabEditPolygon,
  setTabEditPolygon,
  polygonVersionData,
  refetchPolygonVersions,
  refreshEntity,
  mapFunctions,
  polygonData,
  recallEntityData
}: MapEditPolygonPanelProps) => {
  const t = useT();
  const {
    editPolygon,
    setEditPolygon,
    siteData,
    setSelectedPolyVersion,
    setOpenModalConfirmation,
    setPreviewVersion,
    polygonCriteriaMap: polygonMap,
    setHasOverlaps
  } = useMapAreaContext();
  const { onCancel } = mapFunctions;
  useEffect(() => {
    setTabEditPolygon("Attributes");
  }, []);
  const handleClose = () => {
    setEditPolygon?.({ isOpen: false, uuid: "", primary_uuid: "" });
    setHasOverlaps(false);
    setOpenModalConfirmation(false);
    setSelectedPolyVersion({});
    setPreviewVersion(false);
    refreshEntity?.();
    onCancel(polygonData);
    recallEntityData?.();
  };

  const [criteriaData, setCriteriaData] = useState<any>(null);
  const hasOverlaps = (polygonValidation: V2TerrafundCriteriaData) => {
    if (polygonValidation.criteria_list) {
      for (const criteria of polygonValidation.criteria_list) {
        if (criteria.criteria_id === 3 && criteria.valid === 0) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const criteriaDataPolygon = polygonMap[editPolygon?.uuid ?? ""];
    if (criteriaDataPolygon) {
      setHasOverlaps(hasOverlaps(criteriaDataPolygon));
      setCriteriaData(criteriaDataPolygon);
    }
  }, [polygonMap]);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text variant="text-12-light" className="text-white ">
            {siteData?.project?.name ?? "-"}
          </Text>
          <Text variant="text-20-bold" className="mb-4 text-white">
            {siteData?.name ?? "-"}
          </Text>
        </div>

        <Button variant="text" onClick={handleClose} className="text-white hover:text-primary">
          <Icon name={IconNames.CLEAR} className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex rounded-lg bg-white">
        <button
          className={classNames(
            "text-12-semibold w-1/3 rounded-l-lg border border-neutral-300 p-3 hover:bg-neutral-100",
            tabEditPolygon === "Attributes"
              ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
              : "border border-neutral-300"
          )}
          onClick={() => {
            setTabEditPolygon("Attributes");
          }}
        >
          {t("Attributes")}
        </button>
        <button
          className={classNames(
            "text-12-semibold w-1/3 border border-neutral-300 p-3 hover:bg-neutral-100",
            tabEditPolygon === "Checklist"
              ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
              : "border border-neutral-300"
          )}
          onClick={() => {
            setTabEditPolygon("Checklist");
          }}
        >
          {t("Checklist")}
        </button>
        <button
          className={classNames(
            "text-12-semibold w-1/3 rounded-r-lg border border-neutral-300 p-3 hover:bg-neutral-100",
            tabEditPolygon === "Version"
              ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
              : "border border-neutral-300"
          )}
          onClick={() => {
            setTabEditPolygon("Version");
          }}
        >
          {t("Version")}
        </button>
      </div>
      <div className="mr-[-10px] mt-4 h-[calc(100%-132px)] overflow-y-auto pr-2">
        <When condition={tabEditPolygon === "Attributes"}>
          <AttributeInformation handleClose={handleClose} />
        </When>
        <When condition={tabEditPolygon === "Checklist"}>
          <ChecklistInformation criteriaData={criteriaData ?? {}} />
        </When>
        <When condition={tabEditPolygon === "Version"}>
          <VersionInformation
            polygonVersionData={polygonVersionData as SitePolygon[]}
            refetchPolygonVersions={refetchPolygonVersions}
            recallEntityData={recallEntityData}
          />
        </When>
      </div>
    </>
  );
};

export default MapEditPolygonPanel;
