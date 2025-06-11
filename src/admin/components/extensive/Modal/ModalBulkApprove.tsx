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
  onSelectionChange?: (selectedIds: { id: string; name: string; type: string; dateSubmitted: string }[]) => void;
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
  const [selectedIds, setSelectedIds] = useState<{ id: string; name: string; type: string; dateSubmitted: string }[]>(
    []
  );

  const handleSelect = (id: string, selected: boolean, type: string, dateSubmitted: string, name: string) => {
    const newSelectedIds = selected
      ? [...selectedIds, { id, type, dateSubmitted, name }]
      : selectedIds.filter(selectedId => selectedId.id !== id);
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    } else {
      const allIds = data.map(item => item);
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
          {data?.length > 0 && (
            <Button variant="white-page-admin" className="text-14-semibold text-black" onClick={handleSelectAll}>
              {selectedIds.length === data.length ? "Deselect All" : "Select All"}
            </Button>
          )}
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
          {data?.length > 0 ? (
            data.map((item: any) => (
              <CollapsibleRowBulk
                key={item.id}
                item={item}
                selected={selectedIds.some(selected => selected.id === item.id && selected.type === item.type)}
                onSelect={handleSelect}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <Text variant="text-14-light" className="text-neutral-500">
                No reports available for bulk approval
              </Text>
            </div>
          )}
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
        <When condition={data?.length > 0}>
          <Button {...primaryButtonProps}>
            <Text variant="text-14-bold" className="capitalize text-white">
              {primaryButtonText}
            </Text>
          </Button>
        </When>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalBulkApprove;
