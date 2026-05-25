import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { TranslatedText } from "@/i18n/types";
import useOwnT from "@/i18n/useOwnT";

import Icon, { IconNames } from "../Icon/Icon";
import CollapsibleRow from "./components/CollapsibleRow";
import { ModalTranslatedProps } from "./Modal";
import { ModalBaseSubmit } from "./ModalsBases";

type DisplayedPolygonType = {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
  status: StatusEnum | undefined;
  validationStatus?: string | null;
};

export type ModalSubmitProps = ModalTranslatedProps & {
  primaryButtonText?: TranslatedText;
  secondaryButtonText?: TranslatedText;
  status?: StatusEnum;
  onClose?: () => void;
  site: any;
  polygonList?: any;
};

const ModalSubmit: FC<ModalSubmitProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  status,
  onClose,
  site,
  polygonList,
  ...rest
}) => {
  const t = useOwnT();
  const [displayedPolygons, setDisplayedPolygons] = useState<DisplayedPolygonType[]>([]);
  const [polygonsSelected, setPolygonsSelected] = useState<boolean[]>([]);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (polygonList == null) {
      return;
    }
    setPolygonsSelected(polygonList.map((_: any) => false));
  }, [polygonList]);

  useEffect(() => {
    if (polygonList == null) {
      return;
    }

    setPolygonsSelected(polygonList.map((_: any) => false));

    setDisplayedPolygons(
      polygonList.map((polygon: any) => {
        const checked = isAdmin
          ? polygon.validationStatus === "passed" ||
            polygon.validationStatus === "partial" ||
            polygon.validationStatus === "failed"
          : polygon.validationStatus === "passed" || polygon.validationStatus === "partial";

        return {
          id: polygon.polygonUuid,
          checked,
          name: polygon.name ?? "Unnamed Polygon",
          failingCriterias: [],
          status: polygon.status as StatusEnum,
          validationStatus: polygon.validationStatus
        };
      })
    );
  }, [polygonList, isAdmin]);

  const handleSelectAll = (isChecked: boolean) => {
    if (displayedPolygons) {
      const newSelected = displayedPolygons.map((polygon, index) => {
        if (isChecked) {
          return (
            polygonsSelected[index] ||
            (polygon.status !== StatusEnum.PENDING_APPROVAL && polygon.status !== StatusEnum.APPROVED)
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
          {status != null && <Status status={status} className="rounded px-2 py-[2px]" textVariant="text-14-bold" />}
          <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
            <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
          </button>
        </div>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        {iconProps != null && (
          <Icon
            {...iconProps}
            width={iconProps?.width ?? 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        )}
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
        </div>
        <div className="mb-2 flex items-center">
          {content != null && (
            <Text as="div" variant="text-12-light" className="my-1" containHtml>
              {content}
            </Text>
          )}
          <Text variant="text-14-bold" className=" ml-auto flex items-center justify-end gap-2 pr-[76px]">
            {t("Select All")}
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
          {displayedPolygons?.map((polygon, index) => (
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
        {secondaryButtonProps != null && (
          <Button {...secondaryButtonProps} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        )}
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
