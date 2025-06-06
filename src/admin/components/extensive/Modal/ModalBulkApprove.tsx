import { FC, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import CollapsibleRowBulk from "@/components/extensive/Modal/components/CollapsibleRowBulk";

import Icon, { IconNames } from "../../../../components/extensive/Icon/Icon";
import { ModalProps } from "../../../../components/extensive/Modal/Modal";
import { ModalBaseSubmit } from "../../../../components/extensive/Modal/ModalsBases";

export interface ModalBulkApproveProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onClose?: () => void;
  data: any[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
  validation_status?: string | null;
}

const ModalBulkApprove: FC<ModalBulkApproveProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  data,
  onClose,
  onSelectionChange,
  ...rest
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string, selected: boolean) => {
    const newSelectedIds = selected ? [...selectedIds, id] : selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    } else {
      const allIds = data.map(item => item.id);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    }
  };

  return (
    <ModalBaseSubmit {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width ?? 40}
            className={tw("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        </When>
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
          <Button variant="white-page-admin" className="text-14-semibold text-black" onClick={handleSelectAll}>
            {selectedIds.length === data.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="my-2 flex items-center">
          <When condition={!!content}>
            <Text as="div" variant="text-12-light" className="my-1" containHtml>
              {content}
            </Text>
          </When>
        </div>

        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {"Name"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {"Report Type"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {"Date Submitted"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {"Bulk Approve"}
            </Text>
          </header>
          {data?.map((item: any) => (
            <CollapsibleRowBulk
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
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
    </ModalBaseSubmit>
  );
};

export default ModalBulkApprove;
