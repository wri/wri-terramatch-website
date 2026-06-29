import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { memo } from "react";

type SelectionCountLabelProps = {
  count: number;
};

const SelectionCountLabel = memo(function SelectionCountLabel({ count }: SelectionCountLabelProps) {
  const t = useT();

  return (
    <Flex gap={1}>
      <Text color="neutral.100" textStyle="300-bold">
        {count}
      </Text>
      <Text color="neutral.100" textStyle="300">
        {count > 1 ? t("items selected") : t("item selected")}
      </Text>
    </Flex>
  );
});

export default SelectionCountLabel;
