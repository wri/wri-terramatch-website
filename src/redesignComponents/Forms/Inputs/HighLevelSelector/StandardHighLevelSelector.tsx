import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { FC, useId, useMemo } from "react";

import {
  ChakraSlot,
  DEFAULT_EMPTY_MESSAGE,
  DEFAULT_WIDTH,
  getControlStyles,
  getMenuItemStyles,
  menuContentStyles,
  SelectorChevron,
  SelectorEmptyMessage,
  SelectorFolderIcon,
  SelectorLabel,
  SelectorOptionText,
  selectorPositioning,
  toCollectionValue,
  useSelectorOpenState
} from "./HighLevelSelector.shared";
import {
  SelectorImplementationProps,
  SelectorOpenChangeDetails,
  SelectorValueChangeDetails
} from "./HighLevelSelector.types";

const SelectControl = Select.Control as ChakraSlot;
const SelectTrigger = Select.Trigger as ChakraSlot;
const SelectValueText = Select.ValueText as ChakraSlot;
const SelectPositioner = Select.Positioner as ChakraSlot;
const SelectContent = Select.Content as ChakraSlot;
const SelectItem = Select.Item as ChakraSlot;

const StandardHighLevelSelector: FC<SelectorImplementationProps> = ({
  items,
  label,
  autoFocus = false,
  className,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  id,
  name,
  open: controlledOpen,
  placeholder = "Select an option",
  required = false,
  value,
  width = DEFAULT_WIDTH,
  onBlur,
  onChange,
  onOpenChange
}) => {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const labelId = `${rootId}-label`;
  const { open, updateOpen } = useSelectorOpenState(defaultOpen, controlledOpen);
  const collection = useMemo(() => createListCollection({ items }), [items]);

  const handleOpenChange = (details: SelectorOpenChangeDetails) => {
    updateOpen(details.open);
    onOpenChange?.(details.open);
  };

  const handleValueChange = (details: SelectorValueChangeDetails) => {
    onChange?.(details.value[0] ?? "", details.items[0]);
  };

  return (
    <Select.Root
      id={rootId}
      className={className}
      collection={collection}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      disabled={disabled}
      name={name}
      open={open}
      positioning={selectorPositioning}
      position="relative"
      required={required}
      unstyled
      value={toCollectionValue(value)}
      width={width}
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
    >
      <Select.HiddenSelect />
      <SelectorLabel disabled={disabled} id={labelId}>
        {label}
      </SelectorLabel>

      <SelectControl {...getControlStyles(disabled)}>
        <SelectTrigger
          alignItems="center"
          aria-labelledby={labelId}
          autoFocus={autoFocus}
          bg="transparent"
          border="none"
          color={disabled ? "neutral.500" : "neutral.900"}
          cursor={disabled ? "not-allowed" : "pointer"}
          display="flex"
          gap={2}
          height="100%"
          outline="none"
          pb={2}
          pl={2}
          pr={2}
          pt={6}
          textAlign="left"
          width="100%"
          onBlur={onBlur}
        >
          <SelectorFolderIcon disabled={disabled} />
          <SelectValueText
            color={disabled ? "neutral.500" : "neutral.900"}
            overflow="hidden"
            placeholder={placeholder}
            textOverflow="ellipsis"
            textStyle={disabled ? "400" : "400-bold"}
            whiteSpace="nowrap"
          />
          <Select.IndicatorGroup color={disabled ? "neutral.500" : "primary.900"} marginLeft="auto">
            <SelectorChevron open={open} />
          </Select.IndicatorGroup>
        </SelectTrigger>
      </SelectControl>

      <Portal>
        <SelectPositioner zIndex={1400}>
          <SelectContent {...menuContentStyles}>
            {items.length === 0 ? (
              <SelectorEmptyMessage>{emptyMessage}</SelectorEmptyMessage>
            ) : (
              items.map(item => (
                <SelectItem key={item.value} aria-label={item.label} item={item} {...getMenuItemStyles(item.disabled)}>
                  <SelectorOptionText>{item.label}</SelectorOptionText>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </SelectPositioner>
      </Portal>
    </Select.Root>
  );
};

export default StandardHighLevelSelector;
