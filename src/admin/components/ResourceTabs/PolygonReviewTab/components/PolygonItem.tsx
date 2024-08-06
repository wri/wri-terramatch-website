import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import ChecklistErrorsInformation from "@/components/elements/MapPolygonPanel/ChecklistErrorsInformation";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";

export interface MapMenuPanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle?: string;
  status: string;
  isSelected?: boolean;
  poly_id?: string;
  site_id?: string;
  poly_name?: string;
  menu: any;
  primary_uuid?: string;
  isCollapsed: boolean;
}

const PolygonItem = ({
  uuid,
  title,
  subtitle,
  status,
  poly_id = "",
  primary_uuid,
  isSelected,
  className,
  menu,
  isCollapsed,
  ...props
}: MapMenuPanelItemProps) => {
  let imageStatus = `IC_${status.toUpperCase().replace(/-/g, "_")}`;
  const [openCollapse, setOpenCollapse] = useState(false);
  const [validationStatus, setValidationStatus] = useState<boolean>(false);
  const t = useT();
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const { data: criteriaData } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: poly_id
      }
    },
    {
      enabled: !!poly_id
    }
  );

  useEffect(() => {
    setOpenCollapse(isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      const transformedData: ICriteriaCheckItem[] = criteriaData.criteria_list.map((criteria: any) => ({
        id: criteria.criteria_id,
        date: criteria.latest_created_at,
        status: criteria.valid === 1,
        label: validationLabels[criteria.criteria_id],
        extra_info: criteria.extra_info
      }));
      setPolygonValidationData(transformedData);
      setValidationStatus(true);
    } else {
      setValidationStatus(false);
    }
  }, [criteriaData, setValidationStatus]);

  return (
    <div
      {...props}
      className={classNames(
        className,
        "flex flex-col rounded-lg border-2 border-transparent bg-white p-2 hover:border-primary",
        {
          "border-primary-500": isSelected,
          "border-neutral-500 hover:border-neutral-800": !isSelected
        }
      )}
    >
      <div className="flex items-center gap-2">
        <div className="min-h-11 min-w-11">
          <Icon
            name={IconNames[imageStatus as keyof typeof IconNames]}
            className=" h-11 w-11 rounded-lg bg-neutral-300"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          <div className="flex flex-1 items-center gap-1">
            <Text variant="text-14-bold" className="overflow-hidden text-ellipsis whitespace-nowrap" title={t(title)}>
              {t(title)}
            </Text>
            <When condition={validationStatus}>
              <button className="min-w-3 min-h-3" onClick={() => setOpenCollapse(!openCollapse)}>
                <Icon name={IconNames.CHEVRON_DOWN_PA} className="h-3 w-3 text-black" />
              </button>
            </When>

            {menu}
          </div>
          <div className="flex items-center justify-between">
            <Status status={status as StatusEnum} />
            <If condition={validationStatus}>
              <Then>
                <Text variant="text-12">Not Verified</Text>
              </Then>
              <Else>
                <Text variant="text-12" className="text-green">
                  Verified
                </Text>
              </Else>
            </If>
          </div>
        </div>
      </div>
      <When condition={openCollapse}>
        <ChecklistErrorsInformation polygonValidationData={polygonValidationData} />
      </When>
    </div>
  );
};

export default PolygonItem;
