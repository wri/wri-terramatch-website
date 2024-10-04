import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ExpandModalBase } from "./ModalsBases";

export type ModalBaseProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export interface ModalExpandProps extends ModalBaseProps {
  title: string;
  closeModal: (id: string) => void;
}

const ModalExpand: FC<ModalExpandProps> = ({ id, title, children, closeModal, ...rest }) => {
  return (
    <ExpandModalBase {...rest}>
      <div className="flex w-full items-center justify-between p-4">
        <Text variant="text-28-bold" className="text-center uppercase">
          {title}
        </Text>
        <Button variant="white-button-map" onClick={() => closeModal(id)}>
          <div className="flex items-center gap-1">
            <Icon name={IconNames.COLLAPSE} className="h-[14px] w-[14px]" />
            <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
              Collapse
            </Text>
          </div>
        </Button>
      </div>
      {children}
    </ExpandModalBase>
  );
};

export default ModalExpand;
