export const selectorPositioning = {
  gutter: 0,
  placement: "bottom-start",
  sameWidth: true
} as const;

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

export const fieldFocusRingStyles = {
  borderRadius: "0.25rem",
  outline: "0.125rem solid",
  outlineColor: "primary.700",
  outlineOffset: "0.1875rem"
} as const;

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

export const getMenuItemStyles = (disabled = false) =>
  ({
    alignItems: "baseline",
    bg: "transparent",
    borderRadius: "0.25rem",
    color: "neutral.900",
    cursor: disabled ? "not-allowed" : "default",
    display: "flex",
    flexDirection: "row",
    gap: 2,
    height: "2.25rem",
    minHeight: "2.25rem",
    outline: "none",
    position: "relative",
    px: 2,
    py: 2,
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
