import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import { useAllSiteValidations } from "@/connections/Validation";
import { useGetV2SitesSitePolygon } from "@/generated/apiComponents";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonFixability, PolygonFixabilityResult } from "@/utils/polygonFixValidation";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseSubmit } from "./ModalsBases";

export interface ModalFixOverlapsProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toggleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
  selectedUUIDs?: string[];
  site: any;
}

interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
  fixabilityResult?: PolygonFixabilityResult;
}

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
  selectedUUIDs,
  ...rest
}) => {
  const { data: polygonList } = useGetV2SitesSitePolygon({
    pathParams: { site: site.uuid }
  });
  const { allValidations: overlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(site.uuid, OVERLAPPING_CRITERIA_ID);
  const t = useT();

  const [displayedPolygons, setDisplayedPolygons] = useState<DisplayedPolygonType[]>([]);
  const [canFixAnyPolygon, setCanFixAnyPolygon] = useState(false);

  useEffect(() => {
    if (site?.uuid != null) {
      fetchOverlapValidations();
    }
  }, [site?.uuid, fetchOverlapValidations]);

  useEffect(() => {
    if (!polygonList || overlapValidations.length === 0) return;

    const overlappingPolygonUuids = overlapValidations
      .map(validation => validation.polygonUuid)
      .filter(id => id != null);

    let overlappingPolygons = polygonList.filter(
      polygon => polygon.poly_id && overlappingPolygonUuids.includes(polygon.poly_id)
    );

    if (selectedUUIDs != null) {
      overlappingPolygons = overlappingPolygons.filter(
        polygon => polygon.poly_id != null && selectedUUIDs.includes(polygon.poly_id)
      );
    }

    const polygons = overlappingPolygons.map(polygon => {
      const validation = overlapValidations.find(v => v.polygonUuid === polygon.poly_id);
      const overlapCriteria = validation?.criteriaList.find(
        criteria => criteria.criteriaId === OVERLAPPING_CRITERIA_ID
      );
      const fixabilityResult = overlapCriteria?.extraInfo
        ? checkPolygonFixability(overlapCriteria.extraInfo)
        : undefined;

      return {
        id: polygon.uuid,
        checked: true,
        name: polygon.poly_name ?? t("Unnamed Polygon"),
        canBeApproved: false,
        failingCriterias: [`${OVERLAPPING_CRITERIA_ID}`],
        fixabilityResult
      };
    });

    setDisplayedPolygons(polygons);

    const canFixAny = polygons.some(polygon => polygon.fixabilityResult?.canBeFixed === true);
    setCanFixAnyPolygon(canFixAny);
  }, [polygonList, overlapValidations, t, selectedUUIDs]);

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
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Fixable Status")}
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
              <div className="flex flex-1 items-center justify-start">
                <When condition={item.fixabilityResult != null}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4">
                        <Icon
                          name={
                            item.fixabilityResult?.canBeFixed ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS
                          }
                          width={16}
                          height={16}
                          className={item.fixabilityResult?.canBeFixed ? "text-green-500" : "text-red-500"}
                        />
                      </div>
                      <Text
                        variant="text-10-light"
                        className={item.fixabilityResult?.canBeFixed ? "text-green-700" : "text-red-700"}
                      >
                        {item.fixabilityResult?.canBeFixed ? t("Can be fixed") : t("Cannot be fixed")}
                      </Text>
                    </div>
                    <When condition={item.fixabilityResult?.reasons && item.fixabilityResult.reasons.length > 0}>
                      <div className="pl-6">
                        <Text variant="text-8-light" className="text-gray-600">
                          {item.fixabilityResult?.canBeFixed
                            ? t("Meets all fixable criteria (≤3.5% overlap, ≤0.1 ha area)")
                            : item.fixabilityResult?.reasons.join(". ")}
                        </Text>
                      </div>
                    </When>
                  </div>
                </When>
                <When condition={item.fixabilityResult == null}>
                  <Text variant="text-10-light" className="text-gray-500">
                    {t("No data")}
                  </Text>
                </When>
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
        <Button {...primaryButtonProps} disabled={!canFixAnyPolygon}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalFixOverlaps;
