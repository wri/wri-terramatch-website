import { FC } from "react";
import { Else, If, Then, When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import { Option } from "@/types/common";

import { ModalBase, ModalProps } from "./Modal";

export interface ModalConfirmProps extends ModalProps {
  onClose: () => void;
  onConfirm: () => void;
  menu?: Option[];
  menuLabel?: string;
  commentArea?: boolean;
}

const ModalConfirm: FC<ModalConfirmProps> = ({
  title,
  content,
  children,
  onClose,
  onConfirm,
  className,
  menu = [],
  menuLabel,
  commentArea = false,
  ...rest
}) => {
  return (
    <ModalBase {...rest} className={tw("max-w-xs p-5", className)}>
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
        <When condition={menu?.length > 0}>
          <div className="w-fit">
            <Dropdown
              label={menuLabel}
              labelVariant="text-12-light"
              labelClassName="opacity-60 capitalize"
              optionClassName="py-[6px] px-3"
              optionTextClassName="w-full whitespace-nowrap"
              optionVariant="text-12-light"
              placeholder="New Status"
              inputVariant="text-12-light"
              options={menu}
              onChange={() => {}}
            />
          </div>
        </When>
        <When condition={commentArea}>
          <TextArea
            placeholder="Type comment here..."
            name=""
            className="max-h-72 !min-h-0 resize-none rounded-lg border border-grey-750 p-4 text-xs"
            containerClassName="w-full"
            rows={4}
          />
        </When>
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
