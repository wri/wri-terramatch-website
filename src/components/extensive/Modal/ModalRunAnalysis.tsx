import { FC } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_DEFAULT } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithLogo } from "./ModalsBases";

export interface ModalRunAnalysisProps extends ModalProps {
  secondaryButtonText?: string;
  onClose?: () => void;
  primaryButtonText: string;
  title: string;
}

const ModalRunAnalysis: FC<ModalRunAnalysisProps> = ({
  primaryButtonProps,
  title,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  content,
  onClose,
  ...rest
}) => {
  return (
    <ModalBaseWithLogo {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="h-auto w-full overflow-auto px-8 py-8">
        <Text variant="text-20-bold" className="">
          {title}
        </Text>
        <Text variant="text-12-light" className="mb-8">
          {content}
        </Text>
        <div className="mb-8 flex flex-col gap-4">
          <Input
            type="text"
            name="projectName"
            placeholder="Project Name"
            label="Project Name"
            variant="default"
            labelClassName="!capitalize !text-darkCustom"
            labelVariant="text-14-light"
            disabled={true}
            className="bg-neutral-150"
          />
          <Dropdown
            placeholder="Tree Cover Loss (16 polygons not run)"
            label="Indicator"
            options={[
              { title: "Global", value: "Global" },
              { title: "Country", value: "Country" },
              { title: "Subnational", value: "Subnational" }
            ]}
            onChange={() => {}}
            variant={VARIANT_DROPDOWN_DEFAULT}
            className="!min-h-[44px] !py-[9px]"
            labelClassName="!capitalize !text-darkCustom"
            labelVariant="text-14-light"
          />
          <FileInput
            label="Upload Manually"
            labelClassName="!capitalize !text-darkCustom"
            labelVariant="text-14-light"
            files={[]}
            variant={VARIANT_FILE_INPUT_MODAL_ADD}
            descriptionInput={
              <Text variant="text-12-light" className="min-w-max text-center">
                Drag and drop a CSV File based on the required{" "}
                <Text variant="text-12-bold" className="text-primary" as="span">
                  data table
                </Text>{" "}
                schema
              </Text>
            }
          />
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize text-darkCustom">
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

export default ModalRunAnalysis;
