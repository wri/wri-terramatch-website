import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import {
  ESTIMATED_AREA_CRITERIA_ID,
  WITHIN_COUNTRY_CRITERIA_ID
} from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useMapAreaContext } from "@/context/mapArea.provider";

import Icon, { IconNames } from "../Icon/Icon";
import CollapsibleRow from "./components/CollapsibleRow";
import { ModalProps } from "./Modal";
import { ModalBaseSubmit } from "./ModalsBases";

export interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
  status: StatusEnum | undefined;
  validation_status?: string | null;
}

export interface ModalSubmitProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
  site: any;
  polygonList?: any;
}

const ModalSubmit: FC<ModalSubmitProps> = ({
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
  onClose,
  site,
  polygonList,
  ...rest
}) => {
  const t = useT();
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

        return {
          id: polygon.poly_id,
          checked,
          name: polygon.poly_name ?? "Unnamed Polygon",
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
          return (
            polygonsSelected[index] ||
            (polygon.status !== StatusEnum.SUBMITTED && polygon.status !== StatusEnum.APPROVED)
          );
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
        <div className="flex items-center">
          <When condition={status}>
            <Status status={status ?? StatusEnum.DRAFT} className="rounded px-2 py-[2px]" textVariant="text-14-bold" />
          </When>
          <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
            <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
          </button>
        </div>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width ?? 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        </When>
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{t(title)}</Text>
        </div>
        <div className="mb-2 flex items-center">
          <When condition={!!content}>
            <Text as="div" variant="text-12-light" className="my-1" containHtml>
              {t(content)}
            </Text>
          </When>
          <Text variant="text-14-bold" className=" ml-auto flex items-center justify-end gap-2 pr-[76px]">
            Select All
            <Checkbox name="Select All" onClick={e => handleSelectAll((e.target as HTMLInputElement).checked)} />
          </Text>
        </div>

        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {t("Status")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {t("Polygon Check")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {t("Submit")}
            </Text>
          </header>
          {displayedPolygons?.map((polygon: any, index: number) => (
            <CollapsibleRow
              key={polygon.id}
              type="modalSubmit"
              index={index}
              item={polygon}
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

export default ModalSubmit;
