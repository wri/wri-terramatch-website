import { useT } from "@transifex/react";
import { FC } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { SitePolygonsLoadedDataResponse } from "@/generated/apiSchemas";

import Icon, { IconNames } from "../../../../components/extensive/Icon/Icon";
import { ModalProps } from "../../../../components/extensive/Modal/Modal";
import { ModalBaseSubmit } from "../../../../components/extensive/Modal/ModalsBases";
export interface ModalApproveProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onClose?: () => void;
  polygonsList?: SitePolygonsLoadedDataResponse;
  setSubmitPolygonLoaded?: (value: boolean) => void;
  setSaveFlags?: (value: boolean) => void;
  setPolygonLoaded?: (value: boolean) => void;
}

const ModalIdentified: FC<ModalApproveProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  polygonsList,
  onClose,
  ...rest
}) => {
  const t = useT();
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
        <When condition={!!content}>
          <Text as="div" variant="text-12-light" className="mt-1 mb-4" containHtml>
            {content}
          </Text>
        </When>
        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Identified")}
            </Text>
          </header>
          {(polygonsList as SitePolygonsLoadedDataResponse)?.map(item => (
            <div key={item.id} className="flex items-center border-b border-grey-750 px-4 py-2 last:border-0">
              <Text variant="text-12" className="flex-[2]">
                {item.poly_name}
              </Text>
              <div className="flex flex-1 items-center justify-center">
                <div className="flex w-full items-center justify-start gap-2">
                  <When condition={item.is_present}>
                    <div className="h-4 w-4">
                      <Icon name={IconNames.ROUND_GREEN_TICK} width={16} height={16} className="text-green-500" />
                    </div>
                    <Text variant="text-10-light">{"Confirmed"}</Text>
                  </When>
                  <When condition={!item.is_present}>
                    <div className="h-4 w-4">
                      <Icon name={IconNames.ROUND_RED_CROSS} width={16} height={16} className="text-red-500" />
                    </div>
                    <Text variant="text-10-light">{"Unknown Issue. Try Again."}</Text>
                  </When>
                </div>
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
        <Button {...primaryButtonProps}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalIdentified;
