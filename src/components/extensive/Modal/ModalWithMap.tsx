import { FC } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Map from "@/components/elements/Map-mapbox/Map";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";

export const ModalBaseWithMap: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex h-[700px] max-h-full w-[1200px] flex-col items-center justify-start overflow-hidden rounded-lg border-2 border-neutral-100 bg-white",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalWithMapProps extends ModalProps {
  primaryButtonText?: string;
  status?: "Under Review" | "Approved" | "Draft" | "Submitted";
  onCLose?: () => void;
}

const ModalWithMap: FC<ModalWithMapProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  children,
  status,
  onCLose,
  ...rest
}) => {
  return (
    <ModalBaseWithMap {...rest}>
      <div className="flex h-full w-full">
        <div className="flex w-[40%] flex-col">
          <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
            <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
            <div className="flex items-center">
              <When condition={status}>
                <Status status={status ? status : "Draft"} />
              </When>
              <Button variant="transparent-toggle" onClick={onCLose}>
                <Icon name={IconNames.CROSS} width={24} height={24} />
              </Button>
            </div>
          </header>
          <div className="max-h-[100%] w-full flex-[1_1_0] overflow-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <Text variant="text-24-bold">{title}</Text>
            </div>
            <When condition={!!content}>{content}</When>
            {children}
            <div className="flex w-full justify-end">
              <Button {...primaryButtonProps}>
                <Text variant="text-14-bold" className="capitalize text-white">
                  {primaryButtonText}
                </Text>
              </Button>
            </div>
          </div>
        </div>
        <Map className="h-[700px] w-[60%]" hasControls={false} />
      </div>
    </ModalBaseWithMap>
  );
};

export default ModalWithMap;
