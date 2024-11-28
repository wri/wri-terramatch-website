import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithLogoAuto } from "./ModalsBases";

export interface ModalNotesProps extends ModalProps {
  secondaryButtonText?: string;
  onClose?: () => void;
  primaryButtonText: string;
  title: string;
}

const ModalNotes: FC<ModalNotesProps> = ({
  primaryButtonProps,
  title,
  primaryButtonText,
  secondaryButtonProps,
  children,
  content,
  onClose,
  ...rest
}) => {
  return (
    <ModalBaseWithLogoAuto {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <Text variant="text-20-bold" className="">
          {title}
        </Text>
        <Text variant="text-14-light">{content}</Text>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <Button {...primaryButtonProps}>
          <Text variant="text-14-bold" className="capitalize text-darkCustom">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseWithLogoAuto>
  );
};

export default ModalNotes;
