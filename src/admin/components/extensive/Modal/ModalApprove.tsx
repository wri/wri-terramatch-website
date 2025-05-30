import { FC, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import {
  ESTIMATED_AREA_CRITERIA_ID,
  WITHIN_COUNTRY_CRITERIA_ID
} from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import CollapsibleRow from "@/components/extensive/Modal/components/CollapsibleRow";
import { useMapAreaContext } from "@/context/mapArea.provider";

import Icon, { IconNames } from "../../../../components/extensive/Icon/Icon";
import { ModalProps } from "../../../../components/extensive/Modal/Modal";
import { ModalBaseSubmit } from "../../../../components/extensive/Modal/ModalsBases";

export interface ModalApproveProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
  site: any;
  polygonList: any;
}

export interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
  status: StatusEnum | undefined;
  validation_status?: string | null;
}

const checkCriteriaCanBeApproved = (validationStatus: string | null, failingCriterias: string[] | undefined) => {
  if (validationStatus === "passed") {
    return true;
  }

  if (validationStatus === "failed") {
    return false;
  }

  return failingCriterias && failingCriterias.length === 0;
};

const ModalApprove: FC<ModalApproveProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  toogleButton,
  children,
  status,
  site,
  onClose,
  polygonList,
  ...rest
}) => {
  const [displayedPolygons, setDisplayedPolygons] = useState<DisplayedPolygonType[]>([]);
  const [polygonsSelected, setPolygonsSelected] = useState<boolean[]>([]);
  const { validationData } = useMapAreaContext();

  useEffect(() => {
    if (!polygonList) {
      return;
    }
    setPolygonsSelected(polygonList.map((_: any) => false));
  }, [polygonList]);

  useEffect(() => {
    if (!polygonList) {
      return;
    }

    setPolygonsSelected(polygonList.map((_: any) => false));

    setDisplayedPolygons(
      polygonList.map((polygon: any) => {
        const validationInfo = validationData?.[polygon.poly_id] || validationData?.[polygon.uuid];

        const excludedFromValidationCriterias = [ESTIMATED_AREA_CRITERIA_ID, WITHIN_COUNTRY_CRITERIA_ID];

        let failingCriterias: string[] = [];
        if (validationInfo?.nonValidCriteria) {
          const nonValidCriteriasIds = validationInfo.nonValidCriteria.map((r: any) => r.criteria_id);
          failingCriterias = nonValidCriteriasIds.filter((r: any) => !excludedFromValidationCriterias.includes(r));
        }

        const checked =
          polygon.validation_status === "passed" ||
          polygon.validation_status === "partial" ||
          polygon.validation_status === "failed";

        const canBeApproved = checkCriteriaCanBeApproved(polygon.validation_status, failingCriterias);

        return {
          id: polygon.poly_id,
          checked,
          name: polygon.poly_name ?? "Unnamed Polygon",
          canBeApproved,
          failingCriterias,
          status: polygon.status as StatusEnum,
          validation_status: polygon.validation_status
        };
      })
    );
  }, [polygonList, validationData]);

  const handleSelectAll = (isChecked: boolean) => {
    if (displayedPolygons) {
      const newSelected = displayedPolygons.map((polygon, index) => {
        if (isChecked) {
          return polygonsSelected[index] || polygon.canBeApproved;
        }
        return false;
      });
      setPolygonsSelected(newSelected as boolean[]);
    }
  };

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
          <Text variant="text-24-bold">{title}</Text>
        </div>
        <div className="mb-2 flex items-center">
          <When condition={!!content}>
            <Text as="div" variant="text-12-light" className="my-1" containHtml>
              {content}
            </Text>
          </When>
          <Text variant="text-14-bold" className="ml-auto flex items-center justify-end gap-2">
            <Checkbox
              className="flex h-min items-center"
              name="Select All"
              onClick={e => handleSelectAll((e.target as HTMLInputElement).checked)}
            />
            <span className="text-14-bold leading-[normal]">Select All</span>
          </Text>
        </div>

        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {"Name"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {"Status"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {"Polygon Check"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {"Approve"}
            </Text>
          </header>
          {displayedPolygons?.map((item, index) => (
            <CollapsibleRow
              key={item.id}
              type="modalApprove"
              item={item}
              index={index}
              polygonsSelected={polygonsSelected}
              setPolygonsSelected={setPolygonsSelected}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        </When>
        <Button
          {...primaryButtonProps}
          onClick={() => {
            const polygons: any = polygonsSelected
              .map((polygonSelected, index: number) => {
                if (polygonSelected) {
                  return polygonList?.[index];
                }
                return null;
              })
              .filter((polygon: any) => polygon !== null);
            primaryButtonProps?.onClick?.(polygons);
          }}
        >
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalApprove;
