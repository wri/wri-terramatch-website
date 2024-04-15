import classNames from "classnames";
import { FC, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";

export const ModalBaseWithLogo: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex max-h-full w-[776px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white pb-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalWithLogoProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: "Under Review" | "Approved" | "Draft" | "Submitted";
  onCLose?: () => void;
}

const ModalWithLogo: FC<ModalWithLogoProps> = ({
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
  const [buttonToogle, setButtonToogle] = useState(true);
  return (
    <ModalBaseWithLogo {...rest}>
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
      <div className="max-h-[100%] w-full overflow-auto px-8 pt-8">
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
          <When condition={toogleButton}>
            <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
              <Button
                variant={`${buttonToogle ? "white-toggle" : "transparent-toggle"}`}
                onClick={() => setButtonToogle(!buttonToogle)}
                className="w-[111px]"
              >
                <Text variant="text-14-semibold">Comments</Text>
              </Button>
              <Button
                variant={`${buttonToogle ? "transparent-toggle" : "white-toggle"}`}
                onClick={() => setButtonToogle(!buttonToogle)}
                className="w-[111px]"
              >
                <Text variant="text-14-semibold">History</Text>
              </Button>
            </div>
          </When>
        </div>
        <When condition={!!content}>{content}</When>
        {children}
        <div className={classNames("flex w-full justify-end gap-3")}>
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
      </div>
    </ModalBaseWithLogo>
  );
};

export default ModalWithLogo;
