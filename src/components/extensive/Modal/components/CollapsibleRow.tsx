import React, { useEffect, useState } from "react";
import { When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import ChecklistErrorsInformation from "@/components/elements/MapPolygonPanel/ChecklistErrorsInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";
import { isValidCriteriaData, parseValidationData } from "@/helpers/polygonValidation";

import Icon, { IconNames } from "../../Icon/Icon";

interface CollapsibleRowProps {
  polygon: any;
  index: number;
  polygonsSelected: boolean[];
  setPolygonsSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const CollapsibleRow = (props: CollapsibleRowProps) => {
  const { polygon, index, polygonsSelected, setPolygonsSelected } = props;
  const [openCollapse, setOpenCollapse] = useState(false);

  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const { data: criteriaData } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: polygon.poly_id ?? ""
      }
    },
    {
      enabled: !!polygon.poly_id
    }
  );

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      setPolygonValidationData(parseValidationData(criteriaData));
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [criteriaData]);

  return (
    <div className="flex flex-col border-b border-grey-750 px-4 py-2 last:border-0">
      <div className="flex items-center ">
        <Text variant="text-12" className="flex-[2]">
          {polygon.poly_name}
        </Text>
        <div className="flex flex-1 items-center justify-center">
          <Status status={polygon.status as StatusEnum} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full items-center justify-start gap-2">
            <When condition={isValidCriteriaData(criteriaData) && isChecked}>
              <div className="h-4 w-4">
                <Icon name={IconNames.ROUND_GREEN_TICK} width={16} height={16} className="text-green-500" />
              </div>
              <Text variant="text-10-light">{"Passed"}</Text>
            </When>
            <When condition={!isValidCriteriaData(criteriaData) || !isChecked}>
              <div className="h-4 w-4">
                <Icon name={IconNames.ROUND_RED_CROSS} width={16} height={16} className="text-red-500" />
              </div>
              <Text variant="text-10-light"> {isChecked ? "Failed" : "Run Validation Check"}</Text>
            </When>
            <When condition={isChecked}>
              <button className="min-w-3 min-h-3" onClick={() => setOpenCollapse(!openCollapse)}>
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
        <div className="flex items-center">
          <div className="flex-[3]" />
          <ChecklistErrorsInformation polygonValidationData={polygonValidationData} className="flex-[2]" />
        </div>
      </When>
    </div>
  );
};

export default CollapsibleRow;
