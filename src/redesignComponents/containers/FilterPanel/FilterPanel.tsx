import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import Panel from "../Panel/Panel";

export interface FilterPanelProps {
  title: string;
  onClose?: () => void;
  content: React.ReactNode;
  variant?: "fixed" | "floating";
  footer?: React.ReactNode;
  classNameContent?: string;
}

const FilterPanel: FC<FilterPanelProps> = ({
  title,
  onClose,
  content,
  variant = "fixed",
  footer,
  classNameContent
}) => {
  const t = useT();
  return (
    <Panel
      variant={variant}
      header={
        <Box px={4} py={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text textStyle="600-bold" color="neutral.800">
              {t(title)}
            </Text>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="400" color="neutral.700">
                {t("Close")}
              </Text>
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
        </Box>
      }
      content={
        <Flex
          overflowY="auto"
          p={4}
          pr={2}
          mr={2}
          gap={3}
          flexDirection="column"
          scrollbarWidth="auto"
          className={classNames({ "!mb-16": footer }, classNameContent)}
          css={{ scrollbarWidth: "none" }}
        >
          {content}
        </Flex>
      }
      footer={footer}
    />
  );
};

export default FilterPanel;
