import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Else, If, Then } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { V2TerrafundCriteriaData } from "@/generated/apiSchemas";
import { isCompletedDataOrEstimatedArea } from "@/helpers/polygonValidation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMessageValidators } from "@/hooks/useMessageValidations";
import Log from "@/utils/log";

import Text from "../Text/Text";

export const validationLabels: any = {
  3: "No Overlapping Polygon",
  4: "No Self-Intersection",
  5: "Inside Coordinate System",
  6: "Inside Size Limit",
  7: "Within Country",
  8: "No Spike",
  10: "Polygon Type",
  12: "Within Total Area Expected",
  14: "Data Completed",
  15: "Plant Start Date"
};
function useRenderCounter() {
  const ref = useRef(0);
  Log.debug(`Render count: ${++ref.current}`);
}
const ChecklistInformation = ({ criteriaData }: { criteriaData: V2TerrafundCriteriaData }) => {
  useRenderCounter();
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const [validationStatus, setValidationStatus] = useState<boolean>(false);
  const [failedValidationCounter, setFailedValidationCounter] = useState<number>(0);
  const t = useT();
  const isAdmin = useIsAdmin();
  const { getFormatedExtraInfo } = useMessageValidators();

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      const existingValidations = new Map(
        criteriaData.criteria_list.map((criteria: any) => [
          criteria.criteria_id,
          {
            id: criteria.criteria_id,
            date: criteria.latest_created_at,
            status: criteria.valid === 1,
            label: validationLabels[criteria.criteria_id],
            extra_info: criteria.extra_info
          }
        ])
      );

      const transformedData: ICriteriaCheckItem[] = Object.entries(validationLabels).map(([id, label]) => {
        const existingValidation = existingValidations.get(Number(id));

        if (!isAdmin && Number(id) === 14 && existingValidation != null && !existingValidation.status) {
          const extraInfo = existingValidation.extra_info || [];
          const hasOnlyPlantingStatusError =
            Array.isArray(extraInfo) && extraInfo.length === 1 && extraInfo[0].field === "planting_status";

          if (hasOnlyPlantingStatusError) {
            return {
              ...existingValidation,
              status: true
            };
          }
        }

        return (
          existingValidation ?? {
            id: Number(id),
            date: null,
            status: true,
            label: label,
            extra_info: null
          }
        );
      });

      setPolygonValidationData(transformedData);
      setValidationStatus(true);
    } else {
      setValidationStatus(false);
    }
  }, [criteriaData, isAdmin]);

  useEffect(() => {
    if (polygonValidationData != null) {
      const failedValidationCounter = polygonValidationData.reduce((count, record) => {
        return record.status === false ? count + 1 : count;
      }, 0);
      setFailedValidationCounter(failedValidationCounter);
    }
  }, [polygonValidationData]);

  return (
    <div className="text-white">
      <Text variant="text-14-bold">
        {failedValidationCounter} {t("out")} {polygonValidationData.length}
      </Text>
      <Text variant="text-14-light">{t("Validation criteria are not met")}</Text>
      <div className="mt-3 grid gap-3">
        <If condition={validationStatus}>
          <Then>
            {polygonValidationData.map(item => (
              <div key={item.id}>
                <Text variant="text-14-light" className="flex items-center gap-2">
                  <Icon
                    name={
                      item.status
                        ? IconNames.CHECK_PROGRESSBAR
                        : isCompletedDataOrEstimatedArea(item)
                        ? IconNames.EXCLAMATION_CIRCLE_FILL
                        : IconNames.IC_ERROR_PANEL
                    }
                    className={classNames("h-4 w-4 lg:h-5 lg:w-5", {
                      "text-green-400": item.status,
                      "text-yellow-700": !item.status && isCompletedDataOrEstimatedArea(item)
                    })}
                  />
                  {t(item.label)}
                </Text>
                {item.extra_info != null &&
                  getFormatedExtraInfo(item.extra_info, item.id).map(info => (
                    <div className="flex items-start gap-[6px] pl-6" key={`${info}-${item.id}`}>
                      <div className="mt-[3px] flex items-start lg:mt-[4px] wide:mt-[6px]">
                        <span className="text-[7px] text-white">&#9679;</span>
                      </div>
                      <Text variant="text-10-light" className="text-white ">
                        {t(info)}
                      </Text>
                    </div>
                  ))}
              </div>
            ))}
          </Then>
          <Else>
            <Text variant="text-14-light">{t("No criteria checked yet")}</Text>
          </Else>
        </If>
      </div>
    </div>
  );
};

export default ChecklistInformation;
