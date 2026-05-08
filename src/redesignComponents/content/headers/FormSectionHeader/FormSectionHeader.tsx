import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { CheckApprovedIcon, InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import type { FormSectionHeaderProps, FormSectionStatus } from "./types.d";

const getStatusIcon = (status: FormSectionStatus, boxSize: number = 4) =>
  status === "complete" ? (
    <CheckApprovedIcon boxSize={boxSize} color="success.500" />
  ) : (
    <InformationRequiredIcon boxSize={boxSize} color="error.500" />
  );

interface StatusLabelTagProps {
  label: string;
  status: FormSectionStatus;
}

const StatusLabelTag: FC<StatusLabelTagProps> = ({ label, status }) => {
  return (
    <Flex
      alignItems="center"
      gap={2}
      paddingX={2}
      paddingY={1}
      borderRadius="0.25rem"
      backgroundColor="error.100"
      border="0.0625rem solid"
      borderColor="error.300"
    >
      {getStatusIcon(status, 2.5)}
      <Text textStyle="200" color="error.900">
        {label}
      </Text>
    </Flex>
  );
};

const FormSectionHeader: FC<FormSectionHeaderProps> = ({
  label,
  title,
  badge,
  status,
  statusLabel,
  actions,
  showBorder = true,
  className
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      borderBottom={showBorder ? "0.0625rem solid" : "none"}
      borderColor="neutral.300"
      paddingBottom={showBorder ? 4 : 0}
      paddingTop={2}
      marginBottom={2}
      className={className}
    >
      <div className="flex items-center gap-3">
        <Flex alignItems="center" gap={2} textStyle="700-bold" color={"neutral.900"}>
          {label && (
            <Text textStyle="400" color={"neutral.800"}>
              {label}:
            </Text>
          )}
          {title}
        </Flex>
        {badge && <TextBadge>{badge}</TextBadge>}
      </div>
      {statusLabel != null && status != null ? (
        <StatusLabelTag label={statusLabel} status={status} />
      ) : (
        status != null && getStatusIcon(status)
      )}
      {actions}
    </Flex>
  );
};

export default FormSectionHeader;
