import { Combobox, useListCollection } from "@chakra-ui/react";
import { FC, useEffect, useId } from "react";

import {
  ChakraSlot,
  DEFAULT_EMPTY_MESSAGE,
  DEFAULT_WIDTH,
  getControlStyles,
  SelectorChevron,
  SelectorFolderIcon,
  SelectorLabel,
  SelectorMenu,
  selectorPositioning,
  toCollectionValue,
  useAutocompleteMenuNavigation,
  useKeyboardFocusRing,
  useSelectorOpenState
} from "./HighLevelSelector.shared";
import {
  HighLevelSelectorItem,
  SelectorImplementationProps,
  SelectorInputValueChangeDetails,
  SelectorOpenChangeDetails,
  SelectorValueChangeDetails
} from "./HighLevelSelector.types";

const ComboboxControl = Combobox.Control as ChakraSlot;
const ComboboxInput = Combobox.Input as ChakraSlot;
const ComboboxTrigger = Combobox.Trigger as ChakraSlot;
const ComboboxPositioner = Combobox.Positioner as ChakraSlot;
const ComboboxContent = Combobox.Content as ChakraSlot;
const ComboboxItem = Combobox.Item as ChakraSlot;

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const matchesSearch = (itemText: string, filterText: string) =>
  normalize(itemText).includes(normalize(filterText.trim()));

const AutocompleteHighLevelSelector: FC<SelectorImplementationProps> = ({
  items,
  label,
  autoFocus = false,
  className,
  defaultInputValue,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  id,
  inputValue,
  name,
  open: controlledOpen,
  required = false,
  value,
  width = DEFAULT_WIDTH,
  onBlur,
  onChange,
  onInputChange,
  onOpenChange
}) => {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const labelId = `${rootId}-label`;
  const { open, updateOpen } = useSelectorOpenState(defaultOpen, controlledOpen);
  const keyboardFocus = useKeyboardFocusRing();
  const menuNavigation = useAutocompleteMenuNavigation(open);
  const { collection, filter, set } = useListCollection<HighLevelSelectorItem>({
    initialItems: items,
    filter: matchesSearch
  });

  useEffect(() => set(items), [items, set]);

  const handleInputValueChange = (details: SelectorInputValueChangeDetails) => {
    filter(details.reason === "input-change" ? details.inputValue : "");
    onInputChange?.(details.inputValue);
  };

  const handleOpenChange = (details: SelectorOpenChangeDetails) => {
    if (menuNavigation.shouldKeepMenuOpen(details.open)) return;

    updateOpen(details.open);
    if (details.open && (details.reason === "input-click" || details.reason === "trigger-click")) filter("");
    onOpenChange?.(details.open);
  };

  const handleValueChange = (details: SelectorValueChangeDetails) => {
    onChange?.(details.value[0] ?? "", details.items[0]);
  };

  return (
    <Combobox.Root
      id={rootId}
      allowCustomValue={false}
      autoFocus={autoFocus}
      className={className}
      collection={collection}
      defaultInputValue={defaultInputValue}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      disabled={disabled}
      inputBehavior="autocomplete"
      inputValue={inputValue}
      name={name}
      open={open}
      openOnChange
      openOnClick
      positioning={selectorPositioning}
      position="relative"
      required={required}
      selectionBehavior="replace"
      unstyled
      value={toCollectionValue(value)}
      width={width}
      {...keyboardFocus.rootFocusProps}
      onInputValueChange={handleInputValueChange}
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
    >
      <SelectorLabel disabled={disabled} id={labelId}>
        {label}
      </SelectorLabel>

      <ComboboxControl {...getControlStyles(disabled)}>
        <SelectorFolderIcon absolute disabled={disabled} />

        <ComboboxInput
          aria-labelledby={labelId}
          autoComplete="off"
          bg="transparent"
          border="none"
          color={disabled ? "neutral.500" : "neutral.900"}
          cursor={disabled ? "not-allowed" : "text"}
          data-selector-focus-target
          height="100%"
          outline="none"
          pb={2}
          pl={8}
          pr={10}
          pt={6}
          textStyle={disabled ? "400" : "400-bold"}
          width="100%"
          {...keyboardFocus.focusRingStyles}
          onBlur={onBlur}
          onKeyDown={menuNavigation.handleInputKeyDown}
          _placeholder={{ color: "neutral.600", fontWeight: "normal" }}
        />

        <Combobox.IndicatorGroup bottom={2} position="absolute" right={2} zIndex={2}>
          <ComboboxTrigger
            alignItems="center"
            aria-label={open ? "Close options" : "Open options"}
            color={disabled ? "neutral.500" : "primary.900"}
            cursor={disabled ? "not-allowed" : "pointer"}
            display="flex"
            height={8}
            justifyContent="center"
            outline="none"
            width={8}
          >
            <SelectorChevron open={open} />
          </ComboboxTrigger>
        </Combobox.IndicatorGroup>
      </ComboboxControl>

      <SelectorMenu
        Content={ComboboxContent}
        Item={ComboboxItem}
        Positioner={ComboboxPositioner}
        contentRef={menuNavigation.contentRef}
        emptyMessage={emptyMessage}
        items={collection.items}
      />
    </Combobox.Root>
  );
};

export default AutocompleteHighLevelSelector;
