import { Portal, Text } from "@chakra-ui/react";
import { FC, PropsWithChildren, ReactNode, RefObject, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, FolderOpenIcon } from "@/redesignComponents/foundations/Icons";

import { getMenuItemKeyboardProps, handleMenuContentKeyDown } from "./HighLevelSelector.keyboard";
import { getLabelStyles, getMenuItemStyles, menuContentStyles } from "./HighLevelSelector.styles";
import { HighLevelSelectorItem } from "./HighLevelSelector.types";

export const DEFAULT_EMPTY_MESSAGE = "No results found";
export const DEFAULT_WIDTH = "100%";

export type ChakraSlot = FC<PropsWithChildren<Record<string, unknown>>>;

interface SelectorChevronProps {
  open: boolean;
}

export const SelectorChevron: FC<SelectorChevronProps> = ({ open }) =>
  open ? <ChevronUpIcon aria-hidden="true" boxSize={4} /> : <ChevronDownIcon aria-hidden="true" boxSize={4} />;

interface SelectorFolderIconProps {
  absolute?: boolean;
  disabled: boolean;
}

export const SelectorFolderIcon: FC<SelectorFolderIconProps> = ({ absolute = false, disabled }) => (
  <FolderOpenIcon
    aria-hidden="true"
    boxSize={4}
    color={disabled ? "neutral.500" : "primary.600"}
    flexShrink={0}
    {...(absolute && {
      bottom: 3.5,
      left: 2,
      position: "absolute",
      zIndex: 1
    })}
  />
);

interface SelectorTextProps {
  children: ReactNode;
}

interface SelectorLabelProps extends SelectorTextProps {
  disabled: boolean;
  id: string;
}

export const SelectorLabel: FC<SelectorLabelProps> = ({ children, disabled, id }) => (
  <Text as="span" id={id} {...getLabelStyles(disabled)}>
    {children}
  </Text>
);

export const SelectorOptionText: FC<SelectorTextProps> = ({ children }) => (
  <Text as="span" color="neutral.900" data-selector-option-text textStyle="400" lineHeight="normal">
    {children}
  </Text>
);

export const SelectorEmptyMessage: FC<SelectorTextProps> = ({ children }) => (
  <Text color="neutral.600" px={2} py={2} textStyle="400" lineHeight="normal">
    {children}
  </Text>
);

interface SelectorMenuProps {
  Content: ChakraSlot;
  Item: ChakraSlot;
  Positioner: ChakraSlot;
  emptyMessage: ReactNode;
  items: HighLevelSelectorItem[];
  contentRef?: RefObject<HTMLDivElement>;
}

export const SelectorMenu: FC<SelectorMenuProps> = ({ Content, Item, Positioner, contentRef, emptyMessage, items }) => (
  <Portal>
    <Positioner zIndex={1500}>
      <Content ref={contentRef} tabIndex={-1} {...menuContentStyles} onKeyDown={handleMenuContentKeyDown}>
        {items.length === 0 ? (
          <SelectorEmptyMessage>{emptyMessage}</SelectorEmptyMessage>
        ) : (
          items.map(item => (
            <Item
              key={item.value}
              aria-label={item.label}
              item={item}
              {...getMenuItemStyles(item.disabled)}
              {...getMenuItemKeyboardProps(item.disabled)}
            >
              <SelectorOptionText>{item.label}</SelectorOptionText>
            </Item>
          ))
        )}
      </Content>
    </Positioner>
  </Portal>
);

export const toCollectionValue = (value?: string) => (value === undefined ? undefined : value ? [value] : []);

export const useSelectorOpenState = (defaultOpen: boolean, controlledOpen?: boolean) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  const updateOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
  };

  return { open, updateOpen };
};
