import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { fetchPostV2TerrafundValidationPolygon } from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse, V2TerrafundCriteriaData } from "@/generated/apiSchemas";
import { useOnMount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";

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
    validationData,
    setHasOverlaps,
    shouldRefetchValidation
  } = useMapAreaContext();
  const { onCancel } = mapFunctions;
  useOnMount(() => {
    setTabEditPolygon("Attributes");
  });
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

  const [criteriaData, setCriteriaData] = useState<V2TerrafundCriteriaData | null>(null);
  const hasOverlaps = (polygonValidation: any) => {
    if (polygonValidation.nonValidCriteria) {
      for (const criteria of polygonValidation.nonValidCriteria) {
        if (criteria.criteria_id === 3 && criteria.valid === 0) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const fetchValidationData = async () => {
      if (editPolygon?.uuid) {
        try {
          const response = await fetchPostV2TerrafundValidationPolygon({
            queryParams: { uuid: editPolygon.uuid }
          });

          if (response) {
            const transformedData: V2TerrafundCriteriaData = {
              polygon_id: response.polygon_id,
              criteria_list: response.criteria_list || []
            };
            setCriteriaData(transformedData);
          }
        } catch (error) {
          console.error("Error fetching validation data:", error);
        }
      }
    };

    if (shouldRefetchValidation) {
      fetchValidationData();
    }
  }, [shouldRefetchValidation, editPolygon?.uuid]);

  useValueChanged(validationData, () => {
    const siteDataPolygon = validationData[siteData?.uuid ?? ""] ?? [];
    const criteriaDataPolygon = siteDataPolygon.find((polygon: any) => polygon.uuid === editPolygon?.uuid);
    if (criteriaDataPolygon) {
      setHasOverlaps(hasOverlaps(criteriaDataPolygon));

      const transformedData: V2TerrafundCriteriaData = {
        polygon_id: criteriaDataPolygon.uuid,
        criteria_list:
          criteriaDataPolygon.nonValidCriteria?.map((criteria: any) => ({
            criteria_id: criteria.criteria_id,
            valid: criteria.valid,
            latest_created_at: criteria.latest_created_at,
            extra_info: criteria.extra_info
          })) || []
      };

      setCriteriaData(transformedData);
    }
  });
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
