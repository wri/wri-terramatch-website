import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import ChecklistErrorsInformation from "@/components/elements/MapPolygonPanel/ChecklistErrorsInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";
import { isValidCriteriaData, parseValidationData } from "@/helpers/polygonValidation";

export interface MapMenuPanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle?: string;
  status: string;
  isSelected?: boolean;
  siteId?: string;
  polyName?: string;
  menu: any;
  primaryUuid?: string;
  isCollapsed?: boolean;
}

const PolygonItem = ({
  uuid = "",
  title,
  subtitle,
  status,
  primaryUuid: primary_uuid,
  className,
  menu,
  isCollapsed = false,
  ...props
}: MapMenuPanelItemProps) => {
  let imageStatus = `IC_${status.toUpperCase().replace(/-/g, "_")}`;
  const [openCollapse, setOpenCollapse] = useState(false);
  const [validationStatus, setValidationStatus] = useState<boolean | undefined>(undefined);
  const { shouldRefetchValidation, setShouldRefetchValidation } = useMapAreaContext();
  const t = useT();
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const { data: criteriaData, refetch } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: uuid
      }
    },
    {
      enabled: !!uuid
    }
  );

  useEffect(() => {
    refetch();
    setShouldRefetchValidation(false);
  }, [shouldRefetchValidation]);

  useEffect(() => {
    setOpenCollapse(isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      setPolygonValidationData(parseValidationData(criteriaData));
      setValidationStatus(isValidCriteriaData(criteriaData));
    } else {
      setValidationStatus(undefined);
    }
  }, [criteriaData, setValidationStatus]);

  return (
    <div
      {...props}
      className={classNames(
        className,
        "flex flex-col rounded-lg border-2 border-grey-350 bg-white p-2 hover:border-primary"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-h-11 min-w-11">
          <Icon
            name={IconNames[imageStatus as keyof typeof IconNames]}
            className=" h-11 w-11 rounded-lg bg-neutral-300"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 overflow-hidden">
          <div className="flex flex-1 items-center gap-1">
            <Text variant="text-12-bold" className="overflow-hidden text-ellipsis whitespace-nowrap" title={t(title)}>
              {t(title)}
            </Text>
            <button className="min-w-3 min-h-3" onClick={() => setOpenCollapse(!openCollapse)}>
              <Icon
                name={IconNames.CHEVRON_DOWN_PA}
                className={`h-3 w-3 text-black transition-transform duration-300 ${
                  openCollapse ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {menu}
          </div>
          <div className="flex items-center justify-between">
            <Status status={status as StatusEnum} variant="small" textVariant="text-10" />
            <When condition={validationStatus == undefined}>
              <Text variant="text-10" className="flex items-center gap-1 whitespace-nowrap text-grey-700">
                <Icon name={IconNames.CROSS_CIRCLE} className="h-2 w-2" />
                Not Checked
              </Text>
            </When>
            <When condition={validationStatus}>
              <Text variant="text-10" className="flex items-center gap-1 text-green">
                <Icon name={IconNames.STATUS_APPROVED} className="h-2 w-2" />
                Passed
              </Text>
            </When>
            <When condition={validationStatus === false}>
              <Text variant="text-10" className="flex items-center gap-1 whitespace-nowrap text-red-200">
                <Icon name={IconNames.ROUND_RED_CROSS} className="h-2 w-2" />
                Failed
              </Text>
            </When>
          </div>
        </div>
      </div>
      <When condition={openCollapse}>
        <When condition={validationStatus}>
          <Text variant="text-10-light" className="mt-4 text-blueCustom-900 opacity-80">
            This polygon passes even though both validations below have failed. It can still be approved by TerraMatch
            staff.
          </Text>
        </When>
        <ChecklistErrorsInformation polygonValidationData={polygonValidationData} />
      </When>
    </div>
  );
};

export default PolygonItem;
