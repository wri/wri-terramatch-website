import React, { useEffect, useState } from "react";
import { When } from "react-if";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import ChecklistErrorsInformation from "@/components/elements/MapPolygonPanel/ChecklistErrorsInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

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
  const [showWarning, setShowWarning] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setShowWarning(item.validation_status === "partial");
    setIsChecked(item.checked || ["passed", "partial", "failed"].includes(item.validation_status));
  }, [item]);

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
            disabled={
              type === "modalApprove"
                ? !canBeApproved()
                : type === "modalSubmit"
                ? item.status === StatusEnum.SUBMITTED || item.status === StatusEnum.APPROVED
                : false
            }
            onChange={e => {
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
          <ChecklistErrorsInformation
            polygonUuid={item.id}
            className="flex-[2]"
            variant="table"
            showWarning={showWarning}
            onWarningChange={setShowWarning}
          />
        </div>
      </When>
    </div>
  );
};

export default CollapsibleRow;
