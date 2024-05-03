import { FC, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";
import { comentariesItems, polygonStatusLabels } from "./ModalContent/MockedData";

export const ModalBaseWithLogo: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex h-[80%] max-h-full w-[776px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white",
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
            <Status status={status ? status : "Draft"} className="rounded px-2 py-[2px]" textVariant="text-14-bold" />
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
        <When condition={!!content}>
          <Text as="div" variant="text-12-bold" className="mt-1 mb-8" containHtml>
            {content}
          </Text>
        </When>
        <div className="mb-[72px] px-20">
          <StepProgressbar value={80} labels={polygonStatusLabels} classNameLabels="min-w-[111px]" />
        </div>
        <div className="flex flex-col gap-4">
          <ComentaryBox name={"Ricardo"} lastName={"Saavedra"} />
          {comentariesItems.map(item => (
            <Comentary
              key={item.id}
              name={item.name}
              lastName={item.lastName}
              date={item.date}
              comentary={item.comentary}
              files={item.files}
              status={item.status}
            />
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
    </ModalBaseWithLogo>
  );
};

export default ModalWithLogo;
