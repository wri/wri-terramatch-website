import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { SELECTOR_BORDER_WIDTH, SELECTOR_RADIUS } from "@/redesignComponents/Forms/Inputs/HighLevelSelector";
import { CloseIcon } from "@/redesignComponents/foundations/Icons";

type ProjectFacetChipProps = {
  label: string;
  disabled: boolean;
  onRemove: () => void;
};

const ProjectFacetChip: FC<ProjectFacetChipProps> = ({ label, disabled, onRemove }) => {
  const t = useT();

  return (
    <Flex
      align="center"
      gap={2}
      width="100%"
      paddingX={3}
      paddingY={2}
      bg="primary.200"
      borderWidth={SELECTOR_BORDER_WIDTH}
      borderColor="primary.400"
      borderRadius={SELECTOR_RADIUS}
    >
      <Text textStyle="300" color="neutral.900" flex={1} minWidth={0} truncate>
        {label}
      </Text>
      <Flex
        as="button"
        align="center"
        flexShrink={0}
        color="neutral.700"
        cursor={disabled ? "not-allowed" : "pointer"}
        aria-label={t("Remove {name}", { name: label })}
        aria-disabled={disabled}
        onClick={disabled ? undefined : onRemove}
      >
        <CloseIcon boxSize="0.625rem" />
      </Flex>
    </Flex>
  );
};

export default ProjectFacetChip;
