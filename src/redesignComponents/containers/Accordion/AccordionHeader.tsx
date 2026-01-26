import { Text } from "@chakra-ui/react";
import { FC } from "react";

import { CheckApproved, InformationRequired } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import type { AccordionHeaderProps } from "./types";

const getStatusIcon = (status: "success" | "error") =>
  status === "success" ? (
    <CheckApproved boxSize={4} color="success.500" />
  ) : (
    <InformationRequired boxSize={4} color="error.500" />
  );

const AccordionHeader: FC<AccordionHeaderProps> = ({ label, title, badge, status }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Text fontSize="16px" lineHeight="24px" color={"neutral.800"}>
            {label}:
          </Text>
          <Text fontSize="20px" lineHeight="28px" color={"primary.900"}>
            {title}
          </Text>
        </div>
        {badge && <TextBadge>{badge}</TextBadge>}
      </div>
      {status && getStatusIcon(status)}
    </div>
  );
};

export default AccordionHeader;
