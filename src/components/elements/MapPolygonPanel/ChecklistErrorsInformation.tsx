import { useT } from "@transifex/react";
import classNames from "classnames";
import { When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMessageValidators } from "@/hooks/useMessageValidations";
import { TextVariants } from "@/types/common";

import Text from "../Text/Text";

interface ChecklistErrorsInformationProps {
  polygonValidationData: ICriteriaCheckItem[];
  className?: string;
  variant?: "table" | "default";
}

const ChecklistErrorsInformation = ({
  polygonValidationData,
  className,
  variant = "default"
}: ChecklistErrorsInformationProps) => {
  const t = useT();
  const { getFormatedExtraInfo } = useMessageValidators();
  const VARIANT_MAP = {
    table: { text: "text-12", container: "gap-1 mt-1" },
    default: { text: "text-14-light", container: "gap-3 mt-3" }
  };

  return (
    <div className={classNames("grid", className, VARIANT_MAP[variant].container)}>
      {polygonValidationData.map(item => (
        <When condition={!item.status} key={item.id}>
          <Text variant={VARIANT_MAP[variant].text as TextVariants} className="flex items-center gap-2">
            <Icon
              name={IconNames.IC_ERROR_PANEL}
              className={classNames("h-4 w-4", {
                "text-green-400": item.status
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
