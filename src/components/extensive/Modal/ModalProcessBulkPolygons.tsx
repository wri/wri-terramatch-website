import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import CollapsibleRow from "@/components/extensive/Modal/components/CollapsibleRow";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { ModalProps } from "./Modal";
import { ModalBaseSubmit } from "./ModalsBases";

export interface ModalDeleteBulkPolygonsProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onClose?: () => void;
  sitePolygonData: SitePolygonLightDto[];
  selectedPolygonsInCheckbox: string[];
  refetch?: () => void;
  onClick?: (currentSelectedUuids: any) => void;
}

interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved?: boolean | undefined;
  failingCriterias?: string[] | undefined;
  status: StatusEnum | undefined;
  validation_status?: string | null;
}

const ModalProcessBulkPolygons: FC<ModalDeleteBulkPolygonsProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  onClose,
  sitePolygonData,
  selectedPolygonsInCheckbox,
  onClick,
  refetch,
  ...rest
}) => {
  const t = useT();
  const [displayedPolygons, setDisplayedPolygons] = useState<DisplayedPolygonType[]>([]);
  const [polygonsSelected, setPolygonsSelected] = useState<boolean[]>([]);
  const [currentSelectedUuids, setCurrentSelectedUuids] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { validationData } = useMapAreaContext();

  useEffect(() => {
    if (sitePolygonData) {
      const initialSelection = sitePolygonData.map((polygon: any) =>
        selectedPolygonsInCheckbox.includes(polygon.polygonUuid)
      );
      setCurrentSelectedUuids(selectedPolygonsInCheckbox);
      setPolygonsSelected(initialSelection);
      const polygonsData = sitePolygonData.map((polygon: SitePolygonLightDto) => {
        const polygonValidationStatus =
          polygon.validationStatus === undefined ? null : String(polygon.validationStatus);

        return {
          id: polygon.polygonUuid,
          name: polygon.name ?? t("Unnamed Polygon"),
          checked:
            polygonValidationStatus === "passed" ||
            polygonValidationStatus === "partial" ||
            polygonValidationStatus === "failed",
          status: polygon.status as StatusEnum,
          validation_status: polygonValidationStatus
        } as DisplayedPolygonType;
      });

      setDisplayedPolygons(polygonsData);
    }
  }, [sitePolygonData, selectedPolygonsInCheckbox, validationData, t]);

  useEffect(() => {
    const uuids = polygonsSelected
      .map((isSelected, index) => (isSelected ? sitePolygonData[index].polygonUuid : null))
      .filter(uuid => uuid !== null) as string[];

    setCurrentSelectedUuids(uuids);
    setSelectAll(polygonsSelected.length > 0 && polygonsSelected.every(Boolean));
  }, [polygonsSelected, sitePolygonData]);

  const handleSelectAll = (isChecked: boolean) => {
    setPolygonsSelected(sitePolygonData.map(() => isChecked));
    setSelectAll(isChecked);
  };

  return (
    <ModalBaseSubmit {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <div className="flex items-center">
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
          <Text variant="text-14-bold" className="ml-auto flex items-center justify-end gap-2">
            <Checkbox
              className="flex h-min items-center"
              name="Select All"
              checked={selectAll}
              onClick={e => handleSelectAll((e.target as HTMLInputElement).checked)}
            />
            <span className="text-14-bold leading-[normal]">{t("Select All")}</span>
          </Text>
        </div>
        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Status")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Polygon Check")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {t("Selected for Deletion")}
            </Text>
          </header>
          {displayedPolygons?.map((item, index) => (
            <CollapsibleRow
              key={item.id}
              type="modalDelete"
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
        <Button {...primaryButtonProps} onClick={() => onClick && onClick(currentSelectedUuids)}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalProcessBulkPolygons;
