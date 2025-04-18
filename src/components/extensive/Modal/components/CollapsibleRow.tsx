import React, { useEffect, useState } from "react";
import { When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import ChecklistErrorsInformation from "@/components/elements/MapPolygonPanel/ChecklistErrorsInformation";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";
import { isValidCriteriaData, parseValidationData } from "@/helpers/polygonValidation";

interface UnifiedCollapsibleRowProps {
  type: string;
  item: any;
  index: number;
  polygonsSelected: boolean[];
  setPolygonsSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
  criteriaData?: any;
}

const CollapsibleRow = (props: UnifiedCollapsibleRowProps) => {
  const { type, item, index, polygonsSelected, setPolygonsSelected } = props;
  const [openCollapse, setOpenCollapse] = useState(false);
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { validationData } = useMapAreaContext();

  const { data: fetchedCriteriaData, isLoading } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: { uuid: item.id }
    },
    {
      enabled: openCollapse && !validationData?.[item.id] && !validationData?.[item.uuid],
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    }
  );

  useEffect(() => {
    const getValidationData = () => {
      const contextData = validationData?.[item.id];
      if (contextData) {
        return {
          polygon_id: item.id,
          criteria_list: contextData.nonValidCriteria
        };
      }

      const contextDataByUuid = validationData?.[item.uuid];
      if (contextDataByUuid) {
        return {
          polygon_id: item.uuid,
          criteria_list: contextDataByUuid.nonValidCriteria
        };
      }

      return fetchedCriteriaData;
    };

    const criteriaDataPolygon = getValidationData();

    setShowWarning(item.validation_status === "partial");

    if (criteriaDataPolygon?.criteria_list && criteriaDataPolygon.criteria_list.length > 0) {
      setPolygonValidationData(parseValidationData(criteriaDataPolygon));
      setIsChecked(true);
    } else {
      setIsChecked(
        item.validation_status === "passed" ||
          item.validation_status === "partial" ||
          item.validation_status === "failed" ||
          item.checked ||
          false
      );
    }
  }, [item, fetchedCriteriaData, validationData, openCollapse]);

  const canBeApproved = () => {
    if (!item.checked) {
      return false;
    }

    if (item.canBeApproved !== undefined) {
      return item.canBeApproved;
    }

    if (item.validation_status === "passed" || item.validation_status === "partial") {
      return true;
    }

    const contextData = validationData?.[item.id] || validationData?.[item.uuid];
    if (contextData) {
      return contextData.valid;
    }

    if (fetchedCriteriaData) {
      return isValidCriteriaData(fetchedCriteriaData);
    }

    return false;
  };

  return (
    <div className="flex flex-col border-b border-grey-750 px-4 py-2 last:border-0">
      <div className="flex items-center ">
        <Text variant="text-12" className="flex-[2]">
          {item.name}
        </Text>
        <div className="flex flex-1 items-center justify-center">
          <Status status={item.status} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full items-center justify-start gap-2">
            <When condition={canBeApproved() && isChecked}>
              <div className="h-4 w-4">
                <Icon
                  name={showWarning ? IconNames.EXCLAMATION_CIRCLE_FILL : IconNames.ROUND_GREEN_TICK}
                  width={16}
                  height={16}
                  className={showWarning ? "text-yellow-700" : "text-green-500"}
                />
              </div>
              <Text variant="text-12">Passed</Text>
            </When>
            <When condition={!canBeApproved() || !isChecked}>
              <div className="h-4 w-4">
                <Icon name={IconNames.IC_ERROR_PANEL} width={16} height={16} className="text-red-500" />
              </div>
              <Text variant="text-12"> {isChecked ? "Failed" : "Run Validation Check"}</Text>
            </When>
            <When condition={isChecked}>
              <button className="min-h-3 min-w-3" onClick={() => setOpenCollapse(!openCollapse)}>
                <Icon
                  name={IconNames.CHEVRON_DOWN_PA}
                  className={`h-3 w-3 text-black transition-transform duration-300 ${
                    openCollapse ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </When>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Checkbox
            name=""
            checked={!!polygonsSelected?.[index]}
            disabled={type === "modalApprove" ? !canBeApproved() : false}
            onClick={() => {
              setPolygonsSelected(prev => {
                const newSelected = [...prev];
                newSelected[index] = !prev[index];
                return newSelected;
              });
            }}
          />
        </div>
      </div>
      <When condition={openCollapse}>
        <div className="flex items-center ">
          <div className="flex-[3]" />
          {isLoading ? (
            <Text variant="text-12" className="flex-[2]">
              Loading validation data...
            </Text>
          ) : (
            <ChecklistErrorsInformation
              polygonValidationData={polygonValidationData}
              className="flex-[2]"
              variant="table"
            />
          )}
        </div>
      </When>
    </div>
  );
};

export default CollapsibleRow;
