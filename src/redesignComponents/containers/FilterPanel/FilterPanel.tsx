import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import Panel from "../Panel/Panel";

export interface FilterPanelProps {
  title: string;
  onClose?: () => void;
  content: React.ReactNode;
  variant?: "fixed" | "floating";
  footer?: React.ReactNode;
  className?: string;
}

const FilterPanel: FC<FilterPanelProps> = ({ title, onClose, content, variant = "fixed", footer, className }) => {
  const t = useT();
  return (
    <Box className={twMerge("w-full", className)}>
      <Panel
        variant={variant}
        header={
          <Box px={4} py={4}>
            <Flex gap={3} justifyContent="space-between" alignItems="center">
              <Text title={t(title)} textStyle="600-bold" color="neutral.800" className="truncate">
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
        content={<Flex className="h-full min-h-0 flex-col gap-3 overflow-auto p-4 pr-2">{content}</Flex>}
        footer={footer}
      />
    </Box>
  );
};

export default FilterPanel;
