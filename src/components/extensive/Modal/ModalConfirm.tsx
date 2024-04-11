import { FC } from "react";
import { Else, If, Then } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import { ModalBase, ModalProps } from "./Modal";

export interface ModalConfirmProps extends ModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirm: FC<ModalConfirmProps> = ({ title, content, children, onClose, onConfirm, className, ...rest }) => {
  return (
    <ModalBase {...rest} className={tw("p-5", className)}>
      <div className="flex flex-col gap-2">
        <Text variant="text-14-bold" className="text-center">
          {title}
        </Text>
        <If condition={typeof content === "string"}>
          <Then>
            <Text as="div" variant="text-12-light" className="text-grey-300" containHtml>
              {content}
            </Text>
          </Then>
          <Else>{content}</Else>
        </If>

        {children}
      </div>
      <div className="mt-4 flex w-full gap-4">
        <Button variant="white-page-admin" className="w-full" onClick={onClose}>
          <Text variant="text-12-bold" className="capitalize">
            Cancel
          </Text>
        </Button>
        <Button
          className="w-full"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          <Text variant="text-12-bold" className="capitalize">
            Confirm
          </Text>
        </Button>
      </div>
    </ModalBase>
  );
};

export default ModalConfirm;
