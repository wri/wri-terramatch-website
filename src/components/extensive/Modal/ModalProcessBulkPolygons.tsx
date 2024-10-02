import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  useDeleteV2TerrafundProjectPolygons,
  usePostV2TerrafundClipPolygonsPolygons,
  usePostV2TerrafundValidationPolygons
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseSubmit } from "./ModalsBases";

export interface ModalDeleteBulkPolygonsProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onClose?: () => void;
  sitePolygonData: SitePolygonsDataResponse;
  selectedPolygonsInCheckbox: string[];
  refetch?: () => void;
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
  refetch,
  ...rest
}) => {
  const t = useT();
  const [polygonsSelected, setPolygonsSelected] = useState<boolean[]>([]);
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const { mutate: deletePolygons } = useDeleteV2TerrafundProjectPolygons();
  const { mutate: checkPolygons } = usePostV2TerrafundValidationPolygons();
  const { mutate: fixPolygons } = usePostV2TerrafundClipPolygonsPolygons();
  useEffect(() => {
    if (sitePolygonData) {
      const initialSelection = sitePolygonData.map((polygon: any) =>
        selectedPolygonsInCheckbox.includes(polygon.poly_id)
      );
      setPolygonsSelected(initialSelection);
    }
  }, [sitePolygonData, selectedPolygonsInCheckbox]);

  const handleCheckboxChange = (index: number) => {
    setPolygonsSelected(prev => {
      const newSelected = [...prev];
      newSelected[index] = !prev[index];
      return newSelected;
    });
  };
  const handleSelectAll = (isChecked: boolean) => {
    setPolygonsSelected(sitePolygonData.map(() => isChecked));
  };

  const handleProcess = () => {
    showLoader();
    const selectedUUIDs: any = sitePolygonData
      .filter((_, index) => polygonsSelected[index])
      .map(polygon => polygon.poly_id);

    if (primaryButtonText === "Delete") {
      deletePolygons(
        {
          body: {
            uuids: selectedUUIDs
          }
        },
        {
          onSuccess: () => {
            onClose?.();
            refetch?.();
            hideLoader();
            openNotification("success", t("Success!"), t("Polygons deleted successfully"));
          },
          onError: () => {
            hideLoader();
            openNotification("error", t("Error!"), t("Failed to delete polygons"));
          }
        }
      );
    } else if (primaryButtonText === "Check") {
      checkPolygons(
        {
          body: {
            uuids: selectedUUIDs
          }
        },
        {
          onSuccess: () => {
            refetch?.();
            hideLoader();
            openNotification("success", t("Success!"), t("Polygons checked successfully"));
            onClose?.();
          },
          onError: () => {
            hideLoader();
            openNotification("error", t("Error!"), t("Failed to check polygons"));
          }
        }
      );
    } else if (primaryButtonText === "Fix") {
      fixPolygons(
        {
          body: {
            uuids: selectedUUIDs
          }
        },
        {
          onSuccess: response => {
            const processedNames = response?.processed?.map(item => item.poly_name).join(", ");
            if (processedNames) {
              openNotification("success", t("Success!"), t(`Polygons fixed successfully. Fixed: ${processedNames}`));
            } else {
              openNotification("warning", t("Warning"), t("No polygons were fixed."));
            }
            onClose?.();
            refetch?.();
            hideLoader();
          },
          onError: () => {
            hideLoader();
            openNotification("error", t("Error!"), t("Failed to fix polygons"));
          }
        }
      );
    }
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
        <When condition={!!content}>
          <Text as="div" variant="text-12-light" className="my-1" containHtml>
            {t(content)}
          </Text>
        </When>
        <Text variant="text-14-bold" className="mb-2 flex items-center justify-end gap-1 pr-[50px]">
          {t("Select All")} <Checkbox name="Select All" onChange={e => handleSelectAll(e.target.checked)} />
        </Text>
        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {t("Selected for Deletion")}
            </Text>
          </header>
          {sitePolygonData?.map((polygon: any, index: number) => (
            <div key={polygon.uuid} className="flex items-center border-b border-grey-750 px-4 py-2 last:border-0">
              <Text variant="text-12" className="flex-[2]">
                {polygon.poly_name ?? t("Unnamed Polygon")}
              </Text>
              <div className="flex flex-1 items-center justify-center">
                <Checkbox name="" checked={polygonsSelected[index]} onChange={() => handleCheckboxChange(index)} />
              </div>
            </div>
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
        <Button {...primaryButtonProps} onClick={handleProcess}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalProcessBulkPolygons;
