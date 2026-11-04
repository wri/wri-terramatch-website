export const SELECTOR_BORDER_WIDTH = "0.0625rem";

export const SELECTOR_RADIUS = "0.25rem";

const MENU_SHADOW =
  "0 0.25rem 0.375rem -0.25rem rgba(0, 0, 0, 0.1), 0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1)";

export const selectorPositioning = {
  gutter: 0,
  placement: "bottom-start",
  sameWidth: true
} as const;

export const popoverSelectorPositioning = {
  gutter: 4,
  placement: "bottom-end"
} as const;

export const getTriggerStyles = (disabled: boolean) =>
  ({
    bg: "transparent",
    border: "none",
    color: disabled ? "neutral.500" : "neutral.900",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    gap: 2,
    outline: "none",
    pb: 2,
    pl: 2,
    pr: 2,
    textAlign: "left",
    width: "100%"
  } as const);

export const getValueTextStyles = (disabled: boolean) =>
  ({
    color: disabled ? "neutral.500" : "neutral.900",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textStyle: disabled ? "400" : "400-bold",
    whiteSpace: "nowrap"
  } as const);

export const getLabelStyles = (disabled: boolean) =>
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
    borderRadius: SELECTOR_RADIUS,
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

export const fieldFocusRingStyles = {
  borderRadius: "0.25rem",
  outline: "0.125rem solid",
  outlineColor: "primary.700",
  outlineOffset: "0.1875rem"
} as const;

export const contentMenuStyles = {
  bg: "neutral.100",
  border: `${SELECTOR_BORDER_WIDTH} solid`,
  borderColor: "neutral.400",
  borderRadius: SELECTOR_RADIUS,
  borderTopLeftRadius: "0 !important",
  borderTopRightRadius: "0 !important",
  boxShadow: MENU_SHADOW,
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

export const popoverContentStyles = {
  bg: "neutral.100",
  border: `${SELECTOR_BORDER_WIDTH} solid`,
  borderColor: "neutral.300",
  borderRadius: SELECTOR_RADIUS,
  boxShadow: MENU_SHADOW,
  maxWidth: "calc(100vw - 2rem)",
  outline: "none",
  overflow: "hidden"
} as const;

export const groupedContentMenuStyles = {
  ...contentMenuStyles,
  border: "none",
  maxHeight: "24rem",
  p: 0
} as const;

export const menuGroupStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  px: 1,
  py: 2
} as const;

export const menuGroupLabelStyles = {
  pb: 1,
  px: 2
} as const;

const menuItemFocusStyles = {
  bg: "primary.500/20",
  boxShadow:
    "0 0 0 0.125rem var(--chakra-colors-neutral-100), 0 0.125rem 0.125rem 0.25rem color-mix(in srgb, var(--chakra-colors-neutral-900) 5%, transparent)",
  outline: "0.125rem solid",
  outlineColor: "primary.700",
  outlineOffset: "0.125rem",
  zIndex: 1
} as const;

export const getMenuItemStyles = (disabled = false) =>
  ({
    alignItems: "baseline",
    bg: "transparent",
    borderRadius: "0.125rem",
    color: "neutral.900",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    flexDirection: "row",
    gap: 2,
    height: "2.25rem",
    minHeight: "2.25rem",
    outline: "none",
    position: "relative",
    px: 2,
    py: 1.5,
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
    _active: { bg: disabled ? "transparent" : "primary.500/40" },
    _checked: {
      bg: "transparent",
      color: "neutral.900"
    },
    css: disabled
      ? undefined
      : {
          "&:active, &[data-active]": {
            backgroundColor: "color-mix(in srgb, var(--chakra-colors-primary-500) 40%, transparent) !important"
          },
          "[data-nav-source='keyboard'] &[data-highlighted]": menuItemFocusStyles,
          "&[aria-selected='true'] [data-selector-option-text], &[data-state='checked'] [data-selector-option-text]": {
            fontWeight: "700"
          }
        }
  } as const);
