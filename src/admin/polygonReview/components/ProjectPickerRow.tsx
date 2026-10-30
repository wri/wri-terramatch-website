import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, KeyboardEvent, memo, useCallback } from "react";

type ProjectPickerRowProps = {
  uuid: string;
  name: string | null;
  polygonCount: number;
  height: string;
  isSelected: boolean;
  onSelect: (uuid: string) => void;
};

const ProjectPickerRow: FC<ProjectPickerRowProps> = ({ uuid, name, polygonCount, height, isSelected, onSelect }) => {
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
      bg={isSelected ? "primary.100" : undefined}
      _hover={{ bg: "primary.100" }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Text textStyle={isSelected ? "300-bold" : "300"} color="primary.900" textDecoration="underline" truncate>
        {name ?? t("Unnamed project")}
      </Text>
      <Text textStyle="300" color="neutral.900" flexShrink={0}>
        {polygonCount.toLocaleString()}
      </Text>
    </Flex>
  );
};

export default memo(ProjectPickerRow);
