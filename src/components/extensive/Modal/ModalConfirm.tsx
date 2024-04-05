import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import { ModalBase, ModalProps } from "./Modal";

export interface ModalConfirmProps extends ModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirm: FC<ModalConfirmProps> = ({ title, content, children, onClose, onConfirm, ...rest }) => {
  return (
    <ModalBase {...rest} className="p-5">
      <div className="flex flex-col gap-2">
        <Text variant="text-14-bold" className="text-center">
          {title}
        </Text>
        <Text variant="text-12-light" className="text-grey-300" containHtml>
          {content}
        </Text>
        {children}
      </div>
      <div className="mt-4 flex w-full gap-4">
        <Button variant="white-pa" className="w-full" onClick={onClose}>
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
