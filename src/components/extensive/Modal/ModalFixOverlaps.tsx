import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import {
  COMPLETED_DATA_CRITERIA_ID,
  ESTIMATED_AREA_CRITERIA_ID
} from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Button from "@/components/elements/Button/Button";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import {
  GetV2TerrafundValidationSiteResponse,
  useGetV2SitesSitePolygon,
  useGetV2TerrafundValidationSite
} from "@/generated/apiComponents";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseSubmit } from "./ModalsBases";

export interface ModalFixOverlapsProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toggleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
  site: any;
}

interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
}

type Criteria = GetV2TerrafundValidationSiteResponse[number];

const EXCLUDED_VALIDATION_CRITERIAS = [COMPLETED_DATA_CRITERIA_ID, ESTIMATED_AREA_CRITERIA_ID];

const getFailingCriterias = (criteria: Criteria): string[] => {
  const nonValidCriteriasIds = criteria?.nonValidCriteria?.map(r => r.criteria_id) ?? [];
  return nonValidCriteriasIds.filter(r => !EXCLUDED_VALIDATION_CRITERIAS.includes(r));
};

const ModalFixOverlaps: FC<ModalFixOverlapsProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  toggleButton,
  children,
  status,
  site,
  onClose,
  ...rest
}) => {
  const { data: polygonList } = useGetV2SitesSitePolygon({ pathParams: { site: site.uuid } });
  const { data: polygonsCriteriaData } = useGetV2TerrafundValidationSite({
    queryParams: { uuid: site.uuid }
  });
  const t = useT();

  const [displayedPolygons, setDisplayedPolygons] = useState<DisplayedPolygonType[]>([]);

  const memoizedCheckValidCriteria = useMemo(
    () => (criteria: Criteria) => {
      if (!criteria.checked) return false;
      if (criteria?.nonValidCriteria?.length === 0) return true;
      const failingCriterias = getFailingCriterias(criteria);
      return failingCriterias.length === 0;
    },
    []
  );

  useEffect(() => {
    if (!polygonList || !polygonsCriteriaData) return;

    const failingPolygons = polygonList.filter(polygon => {
      const criteria = polygonsCriteriaData.find(criteria => criteria.uuid === polygon.poly_id);
      return !memoizedCheckValidCriteria(criteria as Criteria);
    });

    setDisplayedPolygons(
      failingPolygons.map(polygon => {
        const criteria = polygonsCriteriaData.find(criteria => criteria.uuid === polygon.poly_id) as Criteria;
        const failingCriterias = getFailingCriterias(criteria);
        const approved = memoizedCheckValidCriteria(criteria);

        return {
          id: polygon.uuid,
          checked: criteria?.checked,
          name: polygon.poly_name ?? t("Unnamed Polygon"),
          canBeApproved: approved,
          failingCriterias
        };
      })
    );
  }, [polygonList, polygonsCriteriaData, t, memoizedCheckValidCriteria]);

  return (
    <ModalBaseSubmit {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width ?? 40}
            className={tw("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        </When>
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{t(title)}</Text>
        </div>
        <When condition={!!content}>
          <Text as="div" variant="text-12-light" className="my-1" containHtml>
            {t(content)}
          </Text>
        </When>

        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Polygon Check")}
            </Text>
          </header>
          {displayedPolygons?.map((item, index) => (
            <div key={item.id ?? index} className="flex items-center border-b border-grey-750 px-4 py-2 last:border-0">
              <Text variant="text-12" className="flex-[2]">
                {item.name}
              </Text>
              <div className="flex flex-1 items-center justify-center">
                <div className="flex w-full items-center justify-start gap-2">
                  <When condition={!item.canBeApproved}>
                    <div className="h-4 w-4">
                      <Icon name={IconNames.ROUND_RED_CROSS} width={16} height={16} className="text-red-500" />
                    </div>
                    <Text variant="text-10-light">
                      <When condition={!item.checked}>{"Run Polygon Check"}</When>
                      <When condition={!item.canBeApproved}>
                        {item.failingCriterias?.map(fc => validationLabels[fc]).join(", ")}
                      </When>
                    </Text>
                  </When>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        </When>
        <Button {...primaryButtonProps}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalFixOverlaps;
