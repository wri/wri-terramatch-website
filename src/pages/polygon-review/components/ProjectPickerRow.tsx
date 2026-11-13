import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, KeyboardEvent, memo, useCallback } from "react";

import { SELECTOR_BORDER_WIDTH } from "@/redesignComponents/Forms/Inputs/HighLevelSelector";

type ProjectPickerRowProps = {
  uuid: string;
  name: string | null;
  subtitle?: string;
  polygonCount: number;
  height: string;
  isSelected: boolean;
  onSelect: (uuid: string) => void;
};

const ProjectPickerRow: FC<ProjectPickerRowProps> = ({
  uuid,
  name,
  subtitle,
  polygonCount,
  height,
  isSelected,
  onSelect
}) => {
  const t = useT();

  const handleClick = useCallback(() => onSelect(uuid), [onSelect, uuid]);
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(uuid);
      }
    },
    [onSelect, uuid]
  );

  return (
    <Flex
      as="li"
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      justify="space-between"
      align="center"
      gap={2}
      height={height}
      paddingX={3}
      cursor="pointer"
      borderTopWidth={SELECTOR_BORDER_WIDTH}
      borderColor="neutral.300"
      bg={isSelected ? "primary.200" : undefined}
      _hover={{ bg: isSelected ? "primary.200" : "primary.100" }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Flex direction="column" flex={1} minWidth={0}>
        <Text textStyle="300-bold" color="neutral.900" textDecoration="underline" truncate>
          {name ?? t("Unnamed project")}
        </Text>
        {subtitle != null && (
          <Text textStyle="200" color="neutral.700" truncate>
            {subtitle}
          </Text>
        )}
      </Flex>
      {isSelected && (
        <Text textStyle="200-bold" color="primary.700" flexShrink={0}>
          {t("Selected")}
        </Text>
      )}
      <Text textStyle="300" color="neutral.900" flexShrink={0}>
        {polygonCount.toLocaleString()}
      </Text>
    </Flex>
  );
};

export default memo(ProjectPickerRow);
