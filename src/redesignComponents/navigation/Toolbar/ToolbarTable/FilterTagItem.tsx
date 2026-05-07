import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { CheckIcon, CloseIcon } from "@/redesignComponents/foundations/Icons";

interface FilterTagItemProps {
  label?: string | string[];
}

const FilterTagItem: FC<FilterTagItemProps> = ({ label }) => {
  const t = useT();

  const isArrayLabel = Array.isArray(label);

  return (
    <Button
      className="shrink-0 !border-theme-success-300 !bg-theme-success-100 !text-theme-success-900"
      variant="secondary"
      size="small"
      leftIcon={<CheckIcon boxSize={2.5} color="success.500" />}
      rightIcon={<CloseIcon boxSize={2.5} color="success.900" />}
    >
      {typeof label === "string" && (
        <Text textStyle="200-bold" color="success.900">
          {t(label)}
        </Text>
      )}

      {isArrayLabel && (
        <Flex align="center" gap={1} wrap="nowrap">
          <Text textStyle="200" color="success.900">
            {t("Category:")}
          </Text>

          <Text textStyle="200-bold" color="success.900">
            {label.map(item => t(item)).join(", ")}
          </Text>
        </Flex>
      )}
    </Button>
  );
};

export default FilterTagItem;
