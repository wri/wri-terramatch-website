import { Portal, Text } from "@chakra-ui/react";
import {
  FC,
  FocusEvent,
  KeyboardEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState
} from "react";

import { ChevronDownIcon, ChevronUpIcon, FolderOpenIcon } from "@/redesignComponents/foundations/Icons";

import { HighLevelSelectorItem } from "./HighLevelSelector.types";

export const DEFAULT_EMPTY_MESSAGE = "No results found";
export const DEFAULT_WIDTH = "100%";

export type ChakraSlot = FC<PropsWithChildren<Record<string, unknown>>>;

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
    }
  } as const);

const focusRingStyles = {
  borderRadius: "0.25rem",
  outline: "0.125rem solid",
  outlineColor: "primary.700",
  outlineOffset: "0.1875rem"
} as const;

export const useKeyboardFocusRing = () => {
  const pointerInteraction = useRef(false);
  const [showFocusRing, setShowFocusRing] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => {
      pointerInteraction.current = false;
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return {
    focusRingStyles: showFocusRing ? focusRingStyles : undefined,
    rootFocusProps: {
      onBlurCapture: () => setShowFocusRing(false),
      onFocusCapture: (event: FocusEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const isFieldFocusTarget = target.hasAttribute("data-selector-focus-target");
        setShowFocusRing(isFieldFocusTarget && !pointerInteraction.current && target.matches(":focus-visible"));
      },
      onPointerDownCapture: () => {
        pointerInteraction.current = true;
        setShowFocusRing(false);
      }
    }
  };
};

export const menuContentStyles = {
  bg: "neutral.100",
  border: "0.0625rem solid",
  borderColor: "neutral.400",
  borderRadius: "0.5rem",
  borderTopLeftRadius: 0,
  boxShadow: "0 0.25rem 0.375rem -0.25rem rgba(0, 0, 0, 0.1), 0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1)",
  color: "neutral.900",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Inter, sans-serif",
  fontSize: "0.875rem",
  maxHeight: "18rem",
  outline: "none",
  overflowY: "auto",
  p: 1,
  width: "100%"
} as const;

const menuItemFocusStyles = {
  bg: "transparent",
  borderRadius: "0.375rem",
  boxShadow: "0 0 0 0.125rem var(--chakra-colors-neutral-100), 0 0 0 0.25rem var(--chakra-colors-primary-700)",
  outline: "none",
  zIndex: 1
} as const;

const handleMenuItemKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (event.key === "Tab") {
    event.stopPropagation();
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.click();
};

const MENU_ITEM_SELECTOR = '[role="option"][tabindex="0"]';
const MENU_NAVIGATION_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

export const handleMenuContentKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (!MENU_NAVIGATION_KEYS.has(event.key)) return;

  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR));
  if (items.length === 0) return;

  const activeIndex = items.indexOf(document.activeElement as HTMLElement);
  const highlightedIndex = items.findIndex(item => item.hasAttribute("data-highlighted"));
  const currentIndex = activeIndex >= 0 ? activeIndex : highlightedIndex;

  let nextIndex = currentIndex;
  if (event.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, items.length - 1);
  if (event.key === "ArrowUp") nextIndex = currentIndex < 0 ? items.length - 1 : Math.max(currentIndex - 1, 0);
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = items.length - 1;

  const nextItem = items[nextIndex];
  event.preventDefault();
  window.requestAnimationFrame(() => nextItem.focus());
};

export const useAutocompleteMenuNavigation = (open: boolean) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const transferringFocus = useRef(false);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Tab" || event.shiftKey || !open) return;

    const firstItem = contentRef.current?.querySelector<HTMLElement>(MENU_ITEM_SELECTOR);
    if (!firstItem) return;

    transferringFocus.current = true;
    event.preventDefault();
    firstItem.focus();
    window.requestAnimationFrame(() => {
      transferringFocus.current = false;
    });
  };

  const shouldKeepMenuOpen = (nextOpen: boolean) => !nextOpen && transferringFocus.current;

  return { contentRef, handleInputKeyDown, shouldKeepMenuOpen };
};

export const getMenuItemStyles = (disabled = false) =>
  ({
    alignItems: "flex-start",
    bg: "transparent",
    borderRadius: "0.25rem",
    color: "neutral.900",
    cursor: disabled ? "not-allowed" : "default",
    display: "flex",
    flexDirection: "row",
    gap: 2,
    height: "2.25rem",
    justifyContent: "space-between",
    minHeight: "2.25rem",
    onKeyDown: disabled ? undefined : handleMenuItemKeyDown,
    outline: "none",
    position: "relative",
    px: 2,
    py: 2,
    tabIndex: disabled ? -1 : 0,
    width: "100%",
    _disabled: {
      bg: "transparent",
      color: "neutral.600",
      cursor: "not-allowed"
    },
    _highlighted: {
      bg: disabled ? "transparent" : "primary.500/20",
      outline: "none"
    },
    _hover: { bg: disabled ? "transparent" : "primary.500/20" },
    _active: { bg: disabled ? "transparent" : "rgba(120, 202, 237, 0.4)" },
    _focusVisible: menuItemFocusStyles,
    _checked: {
      bg: "transparent",
      color: "neutral.900"
    },
    css: disabled
      ? undefined
      : {
          "&:active, &[data-active]": {
            backgroundColor: "rgba(120, 202, 237, 0.4) !important"
          },
          "&:focus-visible": {
            backgroundColor: "transparent !important"
          },
          "&[aria-selected='true'] [data-selector-option-text], &[data-state='checked'] [data-selector-option-text]": {
            fontWeight: "700"
          }
        }
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
  <Text as="span" data-selector-option-text textStyle="300">
    {children}
  </Text>
);

export const SelectorEmptyMessage: FC<SelectorTextProps> = ({ children }) => (
  <Text color="neutral.600" px={2} py={2} textStyle="300">
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
            <Item key={item.value} aria-label={item.label} item={item} {...getMenuItemStyles(item.disabled)}>
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
