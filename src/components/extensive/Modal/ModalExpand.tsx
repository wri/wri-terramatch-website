import { useT } from "@transifex/react";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";

import Icon, { IconNames } from "../Icon/Icon";
import { ExpandModalBase } from "./ModalsBases";

export type ModalBaseProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export interface ModalExpandProps extends ModalBaseProps {
  id: string;
  title: string;
  popUpContent?: string;
  closeModal: (id: string) => void;
}

const ModalExpand: FC<ModalExpandProps> = ({ id, title, children, popUpContent, closeModal, ...rest }) => {
  const t = useT();

  return (
    <ExpandModalBase {...rest}>
      <div className="flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-1">
          <Text variant="text-28-bold" className="text-center uppercase">
            {t(title)}
          </Text>
          <When condition={popUpContent}>
            <Tooltip content={popUpContent} width="w-[400px] lg:w-[450px]">
              <Icon name={IconNames.IC_INFO} />
            </Tooltip>
          </When>
        </div>

        <Button variant="white-button-map" onClick={() => closeModal(id)}>
          <div className="flex items-center gap-1">
            <Icon name={IconNames.COLLAPSE} className="h-[14px] w-[14px]" />
            <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
              {t("Collapse")}
            </Text>
          </div>
        </Button>
      </div>
      {children}
    </ExpandModalBase>
  );
};

export default ModalExpand;
