import { Box, Popover, Portal, Text } from "@chakra-ui/react";
import { FC, useCallback } from "react";

import { useKeyboardFocusRing } from "./HighLevelSelector.keyboard";
import { ChakraSlot, DEFAULT_WIDTH, SelectorTriggerContent } from "./HighLevelSelector.shared";
import {
  getControlStyles,
  getTriggerStyles,
  getValueTextStyles,
  popoverContentStyles,
  popoverSelectorPositioning
} from "./HighLevelSelector.styles";
import { HighLevelPopoverSelectorProps } from "./HighLevelSelector.types";

const PopoverTrigger = Popover.Trigger as ChakraSlot;
const PopoverPositioner = Popover.Positioner as ChakraSlot;
const PopoverContent = Popover.Content as ChakraSlot;

const HighLevelPopoverSelector: FC<HighLevelPopoverSelectorProps> = ({
  children,
  open,
  placeholder,
  className,
  contentWidth,
  disabled = false,
  subtitle,
  value,
  width = DEFAULT_WIDTH,
  onOpenChange
}) => {
  const keyboardFocus = useKeyboardFocusRing();
  const handleOpenChange = useCallback(({ open }: { open: boolean }) => onOpenChange(open), [onOpenChange]);
  const hasValue = value != null && value.length > 0;

  return (
    <Box className={className} width={width} maxWidth="100%" {...keyboardFocus.rootFocusProps}>
      <Popover.Root
        open={open}
        onOpenChange={handleOpenChange}
        positioning={popoverSelectorPositioning}
        lazyMount
        unmountOnExit
      >
        <PopoverTrigger
          {...getControlStyles(disabled)}
          {...getTriggerStyles(disabled)}
          alignItems="flex-end"
          bg="neutral.100"
          data-selector-focus-target
          disabled={disabled}
          pt={1}
          {...keyboardFocus.focusRingStyles}
        >
          <SelectorTriggerContent
            disabled={disabled}
            open={open}
            subtitle={hasValue ? subtitle : undefined}
            value={
              <Text as="span" {...getValueTextStyles(disabled)}>
                {hasValue ? value : placeholder}
              </Text>
            }
          />
        </PopoverTrigger>
        <Portal>
          <PopoverPositioner>
            <PopoverContent {...popoverContentStyles} width={contentWidth}>
              {children}
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </Popover.Root>
    </Box>
  );
};

export default HighLevelPopoverSelector;
