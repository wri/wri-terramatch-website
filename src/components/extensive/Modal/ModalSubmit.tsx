import { FC } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";
import { dataSubmitPolygons } from "./ModalContent/MockedData";

export const ModalBaseSubmit: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex max-h-full w-[776px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalSubmitProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: "under-review" | "approved" | "draft" | "submitted";
  onCLose?: () => void;
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
  onCLose,
  ...rest
}) => {
  return (
    <ModalBaseSubmit {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <div className="flex items-center">
          <When condition={status}>
            <Status status={status ? status : "draft"} className="rounded px-2 py-[2px]" textVariant="text-14-bold" />
          </When>
          <button onClick={onCLose} className="ml-2 rounded p-1 hover:bg-grey-800">
            <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
          </button>
        </div>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width || 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height || iconProps?.width || 40 }}
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
              Name
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              Status
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              Submit
            </Text>
          </header>
          {dataSubmitPolygons.map(item => (
            <div key={item.id} className="flex items-center border-b border-grey-750 px-4 py-2 last:border-0">
              <Text variant="text-12" className="flex-[2]">
                {item.name}
              </Text>
              <div className="flex flex-1 items-center justify-center">
                <Status status={item.status} />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <Checkbox name={""} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 py-4 px-8">
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

export default ModalSubmit;
