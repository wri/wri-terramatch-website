import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";

import Button from "../Button/Button";
import Text from "../Text/Text";

const validationLabels: any = {
  3: "No Overlapping Polygon",
  4: "No Self-Intersection",
  6: "Inside Size Limit",
  7: "Within Country",
  8: "No Spike",
  10: "Polygon Type",
  12: "Within Total Area Expected",
  14: "Data Completed"
};

const ChecklistInformation = () => {
  const { openModal, closeModal } = useModalContext();
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const [validationStatus, setValidationStatus] = useState<boolean>(false);
  const [failedValidationCounter, setFailedValidationCounter] = useState<number>(0);
  const t = useT();

  const { editPolygon } = useMapAreaContext();

  // add refetch: reloadCriteriaValidation to the useGetV2TerrafundValidationCriteriaData
  const { data: criteriaData } = useGetV2TerrafundValidationCriteriaData(
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
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      const transformedData: ICriteriaCheckItem[] = criteriaData.criteria_list.map((criteria: any) => ({
        id: criteria.criteria_id,
        date: criteria.latest_created_at,
        status: criteria.valid === 1,
        label: validationLabels[criteria.criteria_id]
      }));
      setPolygonValidationData(transformedData);
      console.log("transformedData", transformedData);
      setValidationStatus(true);
    } else {
      setValidationStatus(false);
    }
  }, [criteriaData]);

  useEffect(() => {
    console.log("polygonValidationData", polygonValidationData);
  }, [polygonValidationData]);

  useEffect(() => {
    if (polygonValidationData) {
      const failedValidationCounter = polygonValidationData.reduce((count, record) => {
        return record.status === false ? count + 1 : count;
      }, 0);
      setFailedValidationCounter(failedValidationCounter);
    }
  }, [polygonValidationData]);

  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
        title={t("Request Support")}
        onClose={closeModal}
        primaryButtonText={t("Submit")}
        content="-&nbsp;&nbsp;•&nbsp;&nbsp;-"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      ></ModalWithMap>
    );
  };
  return (
    <div className="text-white">
      <Text variant="text-14-bold">
        {failedValidationCounter} {t("out")} {polygonValidationData.length}
      </Text>
      <Text variant="text-14-light">{t("Validation criteria are not met")}</Text>
      <Button variant="primary" className="mt-4" onClick={openFormModalHandlerRequestPolygonSupport}>
        {t("request support")}
      </Button>
      <div className="mt-3 grid gap-3">
        <If condition={validationStatus}>
          <Then>
            {polygonValidationData.map((item, index) => (
              <Text variant="text-14-light" key={index} className="flex items-center gap-2">
                <Icon
                  name={item.status ? IconNames.CHECK_PROGRESSBAR : IconNames.IC_ERROR}
                  className={`h-4 w-4 lg:h-5 lg:w-5 ${item.status ? "text-green-400" : ""}`}
                />
                {t(item.label)}
              </Text>
            ))}
            {/* <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("GeoJSON Format")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("WGS84 Projection")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
              {t("Earth Location")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
              {t("Country")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("Reasonable Size Self-Intersecting Topology")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
              {t("Overlapping Polygons")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("Spike")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("Polygon Integrity")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("GeoJSON Format")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
              {t("WGS84 Projection")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
              {t("Earth Location")}
            </Text>
            <Text variant="text-14-light" className="flex items-center gap-2">
              <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
              {t("Country")}
            </Text> */}
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
