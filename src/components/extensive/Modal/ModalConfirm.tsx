import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import { Option, OptionValue } from "@/types/common";

import { ModalBase, ModalProps } from "./Modal";

export type ModalConfirmProps = ModalProps & {
  onClose: () => void;
  onConfirm: (text?: any, opt?: any) => void;
  menu?: Option[];
  menuLabel?: string;
  commentArea?: boolean;
  checkPolygonsSite?: boolean | undefined;
};

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
  checkPolygonsSite,
  ...rest
}) => {
  const t = useT();
  const [data, useData] = useState("");
  const [selectedOption, setSelectedOption] = useState<OptionValue[] | null>(null);
  const [showError, setShowError] = useState(false);

  const handleCommentChange = useCallback((e: any) => {
    useData(e.target.value);
  }, []);

  return (
    <ModalBase {...rest} className={tw("min-w-[30rem] p-5", className)}>
      <div className="flex w-full flex-col gap-2">
        <Text variant="text-14-bold" className="text-center">
          {title}
        </Text>
        {typeof content === "string" ? (
          <Text as="div" variant="text-12-light" className="text-darkCustom" containHtml>
            {content}
          </Text>
        ) : (
          content
        )}
        {(menu?.length ?? 0) > 0 && (
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
              value={selectedOption != null ? selectedOption : []}
              onChange={opt => {
                setSelectedOption(opt);
              }}
              disableOptionTitles={checkPolygonsSite ? ["Approved"] : undefined}
            />
            {showError && (
              <Text variant="text-12-bold" className="text-red">
                {t("Please select an option")}
              </Text>
            )}
          </div>
        )}
        {commentArea && (
          <TextArea
            placeholder="Type comment here..."
            name=""
            value={data}
            onChange={handleCommentChange}
            className="max-h-72 !min-h-0 resize-none rounded-lg border border-grey-750 p-4 text-xs"
            containerClassName="w-full"
            rows={4}
          />
        )}
      </div>
      <div className="mt-4 flex w-full gap-4">
        <Button variant="white-page-admin" className="w-full py-3" onClick={onClose}>
          <Text variant="text-12-bold" className="capitalize">
            {t("Cancel")}
          </Text>
        </Button>
        <Button
          className="w-full py-3"
          onClick={() => {
            onClose();
            if (selectedOption === null && menu?.length > 0) {
              setShowError(true);
              setTimeout(() => setShowError(false), 3000);
              return;
            }
            onConfirm(data, selectedOption ?? [0]);
          }}
        >
          <Text variant="text-12-bold" className="capitalize">
            {t("Confirm")}
          </Text>
        </Button>
      </div>
    </ModalBase>
  );
};

export default ModalConfirm;
