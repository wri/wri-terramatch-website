import { FC, useState } from "react";
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
  onConfirm: (text?: any, opt?: any) => void;
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
  const [data, useData] = useState("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [charCount, setCharCount] = useState<number>(0);

  const handleCommentChange = (e: any) => {
    useData(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <ModalBase {...rest} className={tw("max-w-xs p-5", className)}>
      <div className="flex flex-col gap-2">
        <Text variant="text-14-bold" className="text-center">
          {title}
        </Text>
        <If condition={typeof content === "string"}>
          <Then>
            <Text as="div" variant="text-12-light" className="text-darkCustom" containHtml>
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
              placeholder={"New Status"}
              inputVariant="text-12-light"
              options={menu}
              onChange={opt => {
                setSelectedOption(opt);
              }}
            />
            <If condition={showError}>
              <Text variant="text-12-bold" className="text-red">
                Please select an option
              </Text>
            </If>
          </div>
        </When>
        <When condition={commentArea}>
          <TextArea
            placeholder="Type comment here..."
            name=""
            value={data}
            onChange={e => handleCommentChange(e)}
            className="max-h-72 !min-h-0 resize-none rounded-lg border border-grey-750 p-4 text-xs"
            containerClassName="w-full"
            rows={4}
          />
          <div className={`text-right text-xs ${charCount > 255 ? "text-red" : "text-grey-500"}`}>
            {charCount}/255 characters
          </div>
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
            if (selectedOption === null && menu?.length > 0) {
              setShowError(true);
              setTimeout(() => setShowError(false), 3000);
              return;
            }
            onConfirm(data, selectedOption || [0]);
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
