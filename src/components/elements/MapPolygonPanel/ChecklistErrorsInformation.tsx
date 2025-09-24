import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { usePolygonValidation } from "@/connections/Validation";
import {
  hasCompletedDataWhitinStimatedAreaCriteriaInvalidV3,
  parseV3ValidationData,
  shouldShowAsWarning
} from "@/helpers/polygonValidation";
import { useMessageValidators } from "@/hooks/useMessageValidations";
import { TextVariants } from "@/types/common";
import { ICriteriaCheckItem } from "@/types/validation";

import Text from "../Text/Text";

interface ChecklistErrorsInformationProps {
  polygonUuid: string;
  className?: string;
  variant?: "table" | "default";
  showWarning?: boolean;
  onWarningChange?: (showWarning: boolean) => void;
}

const ChecklistErrorsInformation = ({
  polygonUuid,
  className,
  variant = "default",
  showWarning = false,
  onWarningChange
}: ChecklistErrorsInformationProps) => {
  const t = useT();
  const { getFormatedExtraInfo } = useMessageValidators();
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const v3ValidationData = usePolygonValidation({
    polygonUuid
  });

  useEffect(() => {
    if (v3ValidationData?.criteriaList != null && v3ValidationData.criteriaList.length > 0) {
      setPolygonValidationData(parseV3ValidationData(v3ValidationData));
      setIsLoading(false);
      if (onWarningChange) {
        onWarningChange(hasCompletedDataWhitinStimatedAreaCriteriaInvalidV3(v3ValidationData));
      }
    } else {
      setIsLoading(v3ValidationData == null);
    }
  }, [v3ValidationData, onWarningChange]);
  const VARIANT_MAP = {
    table: { text: "text-12", container: "gap-1 mt-1" },
    default: { text: "text-14-light", container: "gap-3 mt-3" }
  };

  if (isLoading) {
    return (
      <div className={classNames("flex items-center justify-center py-4", className)}>
        <Text variant="text-12" className="text-gray-500">
          Loading validation data...
        </Text>
      </div>
    );
  }

  return (
    <div className={classNames("grid", className, VARIANT_MAP[variant].container)}>
      {polygonValidationData.map(item => (
        <When condition={!item.status} key={item.id}>
          <Text variant={VARIANT_MAP[variant].text as TextVariants} className="flex items-center gap-2">
            <Icon
              name={shouldShowAsWarning(item) ? IconNames.EXCLAMATION_CIRCLE_FILL : IconNames.IC_ERROR_PANEL}
              className={classNames("h-4 w-4", {
                "text-green-400": item.status,
                "text-yellow-700": shouldShowAsWarning(item)
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
