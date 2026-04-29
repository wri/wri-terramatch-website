import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { CheckApprovedIcon, InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import type { AccordionHeaderProps, AccordionStatus } from "./types";

const getStatusIcon = (status: AccordionStatus, boxSize: number = 4) =>
  status === "complete" ? (
    <CheckApprovedIcon boxSize={boxSize} color="success.500" />
  ) : (
    <InformationRequiredIcon boxSize={boxSize} color="warning.500" />
  );

interface StatusLabelTagProps {
  label: string;
  status: AccordionStatus;
}

const StatusLabelTag: FC<StatusLabelTagProps> = ({ label, status }) => {
  return (
    <Flex
      alignItems="center"
      gap={2}
      paddingX={2}
      paddingY={1}
      borderRadius="4px"
      backgroundColor="error.100"
      border="1px solid"
      borderColor="error.300"
    >
      {getStatusIcon(status, 2.5)}
      <Text textStyle="200" color="error.900">
        {label}
      </Text>
    </Flex>
  );
};

const AccordionHeader: FC<AccordionHeaderProps> = ({ label, title, badge, status, statusLabel }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="line-height-[28px] flex items-center gap-2 text-[20px] text-theme-primary-900">
          {label && (
            <Text textStyle="400" color={"neutral.800"}>
              {label}:
            </Text>
          )}
          {title}
        </div>
        {badge && <TextBadge>{badge}</TextBadge>}
      </div>
      {statusLabel != null && status != null ? (
        <StatusLabelTag label={statusLabel} status={status} />
      ) : (
        status != null && getStatusIcon(status)
      )}
    </div>
  );
};

export default AccordionHeader;
