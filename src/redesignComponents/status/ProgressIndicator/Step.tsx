import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { Check, InformationRequiredSimple } from "@/redesignComponents/foundations/Icons";

import { StepProps } from "./types";

export const Step: FC<StepProps> = props => {
  const { index, status, label, actions } = props;
  const getLabelStyle = (status: StepProps["status"]) => {
    switch (status) {
      case "completed":
        return { color: "neutral.700" };
      case "active":
        return { color: "primary.900", fontWeight: "bold" };
      case "available":
        return { color: "neutral.700" };
      case "disabled":
        return { color: "neutral.600" };
      case "error":
        return { color: "error.900" };
      default:
        return { color: "neutral.600" };
    }
  };
  const getContent = (status: StepProps["status"]) => {
    switch (status) {
      case "completed":
        return <Check color="primary.800" />;
      case "active":
        return (
          <Text color="primary.800" fontWeight="bold">
            {index}
          </Text>
        );
      case "available":
        return (
          <Text color="neutral.700" fontWeight="bold">
            {index}
          </Text>
        );
      case "disabled":
        return (
          <Text color="neutral.500" fontWeight="bold">
            {index}
          </Text>
        );
      case "error":
        return <InformationRequiredSimple color="error.500" />;
    }
  };

  const getStyleBox = (status: StepProps["status"]) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "primary.100", borderColor: "primary.400" };
      case "active":
        return { backgroundColor: "primary.100", borderColor: "primary.400" };
      case "available":
        return { backgroundColor: "neutral.200", borderColor: "neutral.500" };
      case "disabled":
        return { backgroundColor: "neutral.300", borderColor: "neutral.300" };
      case "error":
        return { backgroundColor: "error.100", borderColor: "error.300" };
    }
  };

  return (
    <Flex gap={3} alignItems="center" justify="space-between">
      <Flex alignItems="center" gap={2}>
        <Flex
          rounded="full"
          alignItems="center"
          justifyContent="center"
          boxShadow="200"
          boxSize={8}
          border="1px solid"
          {...getStyleBox(status)}
        >
          {getContent(status)}
        </Flex>
        <Text fontSize="16px" lineHeight="24px" {...getLabelStyle(status)}>
          {label}
        </Text>
      </Flex>
      {actions}
    </Flex>
  );
};
