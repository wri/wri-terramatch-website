import { Text } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, FolderOpenIcon } from "@/redesignComponents/foundations/Icons";

export const DEFAULT_EMPTY_MESSAGE = "No results found";
export const DEFAULT_WIDTH = "100%";

export type ChakraSlot = FC<any>;

export const selectorPositioning = {
  gutter: 0,
  placement: "bottom-start",
  sameWidth: true
} as const;

const getLabelStyles = (disabled: boolean) =>
  ({
    color: disabled ? "neutral.500" : "neutral.900",
    left: 2,
    lineHeight: "normal",
    marginTop: "-0.25rem",
    pointerEvents: "none",
    position: "absolute",
    textStyle: "300",
    top: 2,
    zIndex: 2
  } as const);

export const getControlStyles = (disabled: boolean) =>
  ({
    bg: "neutral.100",
    border: "none",
    borderRadius: "0.25rem",
    height: "3.6875rem",
    outline: "none",
    position: "relative",
    _after: {
      bg: disabled ? "neutral.500" : "primary.600",
      bottom: 0,
      content: '""',
      height: "0.125rem",
      left: 0,
      pointerEvents: "none",
      position: "absolute",
      right: 0
    },
    _focusWithin: {
      outline: "0.125rem solid",
      outlineColor: "primary.700",
      outlineOffset: "0.1875rem"
    }
  } as const);

export const menuContentStyles = {
  bg: "neutral.100",
  border: "none",
  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.14)",
  maxHeight: "18rem",
  overflowY: "auto",
  py: 1
} as const;

export const getMenuItemStyles = (disabled = false) =>
  ({
    color: "neutral.900",
    cursor: disabled ? "not-allowed" : "pointer",
    minHeight: "3.25rem",
    px: 4,
    py: 3,
    textStyle: "400",
    _disabled: { color: "neutral.500", cursor: "not-allowed" },
    _highlighted: { bg: "primary.200", outline: "none" },
    _hover: { bg: disabled ? "neutral.100" : "primary.100" }
  } as const);

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
  <Text as="span" textStyle="400">
    {children}
  </Text>
);

export const SelectorEmptyMessage: FC<SelectorTextProps> = ({ children }) => (
  <Text color="neutral.600" px={4} py={3} textStyle="400">
    {children}
  </Text>
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
