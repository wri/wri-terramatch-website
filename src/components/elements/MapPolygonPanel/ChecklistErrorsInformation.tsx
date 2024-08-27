import { useT } from "@transifex/react";
import classNames from "classnames";
import { When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { isCompletedDataOrEstimatedArea } from "@/helpers/polygonValidation";
import { useMessageValidators } from "@/hooks/useMessageValidations";

import Text from "../Text/Text";

interface ChecklistErrorsInformationProps {
  polygonValidationData: ICriteriaCheckItem[];
  className?: string;
}

const ChecklistErrorsInformation = ({ polygonValidationData, className }: ChecklistErrorsInformationProps) => {
  const t = useT();
  const { getFormatedExtraInfo } = useMessageValidators();

  return (
    <div className={classNames("mt-3 grid gap-3", className)}>
      {polygonValidationData.map(item => (
        <When condition={!item.status} key={item.id}>
          <Text variant="text-14-light" className="flex items-center gap-2">
            <Icon
              name={isCompletedDataOrEstimatedArea(item) ? IconNames.EXCLAMATION_CIRCLE_FILL : IconNames.IC_ERROR_PANEL}
              className={classNames("h-4 w-4 lg:h-5 lg:w-5", {
                "text-green-400": item.status,
                "text-yellow-700": isCompletedDataOrEstimatedArea(item)
              })}
            />
            {t(item.label)}
          </Text>
          {item.extra_info &&
            getFormatedExtraInfo(item.extra_info, item.id).map(info => (
              <div className="flex items-start gap-[6px] pl-6" key={`${info}-${item.id}`}>
                <div className="mt-[3px] flex items-start lg:mt-[4px] wide:mt-[6px]">
                  <span className="text-[7px] ">&#9679;</span>
                </div>
                <Text variant="text-10-light">{t(info)}</Text>
              </div>
            ))}
        </When>
      ))}
    </div>
  );
};

export default ChecklistErrorsInformation;
