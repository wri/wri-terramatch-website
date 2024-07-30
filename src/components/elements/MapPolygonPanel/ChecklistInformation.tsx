import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";

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
  14: "Data Completed"
};

const ChecklistInformation = () => {
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const [validationStatus, setValidationStatus] = useState<boolean>(false);
  const [failedValidationCounter, setFailedValidationCounter] = useState<number>(0);
  const t = useT();

  const { editPolygon, shouldRefetchValidation, setShouldRefetchValidation } = useMapAreaContext();

  const { data: criteriaData, refetch: reloadCriteriaValidation } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: editPolygon?.uuid
      }
    },
    {
      enabled: !!editPolygon?.uuid
    }
  );

  useEffect(() => {
    if (shouldRefetchValidation) {
      reloadCriteriaValidation();
      setShouldRefetchValidation(false);
    }
  }, [shouldRefetchValidation]);

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      const transformedData: ICriteriaCheckItem[] = criteriaData.criteria_list.map((criteria: any) => ({
        id: criteria.criteria_id,
        date: criteria.latest_created_at,
        status: criteria.valid === 1,
        label: validationLabels[criteria.criteria_id],
        messages: criteria.messages
      }));
      setPolygonValidationData(transformedData);
      setValidationStatus(true);
    } else {
      setValidationStatus(false);
    }
  }, [criteriaData]);

  useEffect(() => {
    if (polygonValidationData) {
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
            {polygonValidationData.map((item, index) => (
              <>
                <Text variant="text-14-light" key={index} className="flex items-center gap-2">
                  <Icon
                    name={item.status ? IconNames.CHECK_PROGRESSBAR : IconNames.IC_ERROR_PANEL}
                    className={`h-4 w-4 lg:h-5 lg:w-5 ${item.status ? "text-green-400" : ""}`}
                  />
                  {t(item.label)}
                </Text>
                {item.messages &&
                  item.messages.map((info: any, index: number) => (
                    <Text key={index} variant="text-14-light">
                      {t(info)}
                    </Text>
                  ))}
              </>
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
