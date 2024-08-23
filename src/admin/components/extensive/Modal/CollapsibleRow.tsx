import React, { useState } from "react";
import { When } from "react-if";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import ChecklistErrorsInformation from "@/components/elements/MapPolygonPanel/ChecklistErrorsInformation";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Icon from "@/components/extensive/Icon/Icon";

import { DisplayedPolygonType } from "./ModalApprove";

interface CollapsibleRowProps {
  item: DisplayedPolygonType;
  index: number;
  polygonsSelected: boolean[];
  setPolygonsSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const CollapsibleRow = (props: CollapsibleRowProps) => {
  const { item, index, polygonsSelected, setPolygonsSelected } = props;
  const [openCollapse, setOpenCollapse] = useState(false);
  return (
    <div className="flex flex-col border-b border-grey-750 px-4 py-2 last:border-0">
      <div className="flex items-center ">
        <Text variant="text-12" className="flex-[2]">
          {item.name}
        </Text>
        <div className="flex-1">
          <Status status={item.status ?? StatusEnum.DRAFT} className="w-fit" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full items-center justify-start gap-2">
            <When condition={item.canBeApproved}>
              <div className="h-4 w-4">
                <Icon name={IconNames.ROUND_GREEN_TICK} width={16} height={16} className="text-green-500" />
              </div>
              <Text variant="text-10-light">{"Passed"}</Text>
            </When>
            <When condition={!item.canBeApproved}>
              <div className="h-4 w-4">
                <Icon name={IconNames.ROUND_RED_CROSS} width={16} height={16} className="text-red-500" />
              </div>
              <Text variant="text-10-light">
                <When condition={!item.checked}>{"Run Polygon Check"}</When>
                {item.failingCriterias?.map(fc => validationLabels[fc]).join(", ")}
              </Text>
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
            disabled={!item.canBeApproved}
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
          <ChecklistErrorsInformation polygonValidationData={[]} className="flex-[2]" />
        </div>
      </When>
    </div>
  );
};

export default CollapsibleRow;
