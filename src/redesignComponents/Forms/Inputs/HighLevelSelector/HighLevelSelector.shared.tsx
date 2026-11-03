import { Portal, Text } from "@chakra-ui/react";
import { FC, Fragment, PropsWithChildren, ReactNode, useState } from "react";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, FolderOpenIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { MenuContentProps } from "./HighLevelSelector.keyboard";
import {
  contentMenuStyles,
  getLabelStyles,
  getMenuItemStyles,
  groupedContentMenuStyles,
  menuGroupLabelStyles,
  menuGroupStyles
} from "./HighLevelSelector.styles";
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
  <Text as="span" color="neutral.900" truncate data-selector-option-text textStyle="400" lineHeight="normal">
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
  ItemGroup: ChakraSlot;
  ItemGroupLabel: ChakraSlot;
  ItemIndicator: ChakraSlot;
  Positioner: ChakraSlot;
  contentProps: MenuContentProps;
  emptyMessage: ReactNode;
  items: HighLevelSelectorItem[];
}

type SelectorMenuSection = {
  group?: string;
  items: HighLevelSelectorItem[];
};

const getMenuSections = (items: HighLevelSelectorItem[]) =>
  items.reduce<SelectorMenuSection[]>((sections, item) => {
    const lastSection = sections[sections.length - 1];
    if (lastSection != null && lastSection.group === item.group) {
      lastSection.items.push(item);
    } else {
      sections.push({ group: item.group, items: [item] });
    }
    return sections;
  }, []);

export const SelectorMenu: FC<SelectorMenuProps> = ({
  Content,
  Item,
  ItemGroup,
  ItemGroupLabel,
  ItemIndicator,
  Positioner,
  contentProps,
  emptyMessage,
  items
}) => {
  const isGrouped = items.some(item => item.group != null);

  const renderItem = (item: HighLevelSelectorItem) => (
    <Item key={item.value} aria-label={item.label} item={item} {...getMenuItemStyles(item.disabled)}>
      <ItemIndicator>
        <CheckIcon aria-hidden="true" width={4} color="neutral.800" height={"auto"} flexShrink={0} />
      </ItemIndicator>
      <SelectorOptionText>{item.label}</SelectorOptionText>
    </Item>
  );

  return (
    <Portal>
      <Positioner zIndex={1500}>
        <Content {...(isGrouped ? groupedContentMenuStyles : contentMenuStyles)} {...contentProps}>
          {items.length === 0 ? (
            <SelectorEmptyMessage>{emptyMessage}</SelectorEmptyMessage>
          ) : isGrouped ? (
            getMenuSections(items).map((section, index) => (
              <Fragment key={section.group ?? `ungrouped-${index}`}>
                {index > 0 && <SimpleDivider width="auto" mx={3} />}
                <ItemGroup {...menuGroupStyles}>
                  {section.group != null && (
                    <ItemGroupLabel {...menuGroupLabelStyles}>
                      <Text as="span" textStyle="300" color="neutral.700">
                        {section.group}
                      </Text>
                    </ItemGroupLabel>
                  )}
                  {section.items.map(renderItem)}
                </ItemGroup>
              </Fragment>
            ))
          ) : (
            items.map(renderItem)
          )}
        </Content>
      </Positioner>
    </Portal>
  );
};

export const toCollectionValue = (value?: string) => (value == null ? undefined : value.length > 0 ? [value] : []);

export const useSelectorOpenState = (defaultOpen: boolean, controlledOpen?: boolean) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  const updateOpen = (nextOpen: boolean) => {
    if (controlledOpen == null) setUncontrolledOpen(nextOpen);
  };

  return { open, updateOpen };
};
