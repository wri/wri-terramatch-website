import { Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import type { FC } from "react";

import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import { DueIcon } from "@/redesignComponents/foundations/Icons";

import type { ListSectionHeaderLevel, ListSectionHeaderProps } from "./types";

const levelStyles: Record<
  ListSectionHeaderLevel,
  {
    gap: number;
  }
> = {
  "top-level": {
    gap: 3
  },
  "sub-level": {
    gap: 4
  }
};

const ListSectionHeader: FC<ListSectionHeaderProps> = ({
  level = "top-level",
  label,
  title,
  caption,
  statusLabels,
  icon,
  className,
  dueDate
}) => {
  const gap = levelStyles[level].gap;

  return (
    <Flex alignItems="center" justifyContent="space-between" width="100%" gap={3} className={className}>
      <Flex alignItems="center" gap={gap} minWidth={0} flex={1}>
        {icon}
        <Flex direction="column" minWidth={0} alignItems="flex-start">
          <Flex alignItems="center" gap={1}>
            {label && (
              <Text textStyle="300" color="neutral.800">
                {label}:
              </Text>
            )}
            <Text
              color="primary.900"
              textStyle={level === "top-level" ? "500-bold" : "400-bold"}
              className={classNames("truncate", {
                "text-decoration-solid underline underline-offset-2": level === "top-level"
              })}
            >
              {title}
            </Text>
          </Flex>
          {caption != null && (
            <Text textStyle="300" className="truncate">
              {caption}
            </Text>
          )}
        </Flex>
        {dueDate && (
          <FeedbackTag icon={<DueIcon />} label={dueDate} onClose={() => {}} size="default" type="info-white" />
        )}
      </Flex>
      {statusLabels != null && (
        <Flex alignItems="center" gap={2} flexShrink={0}>
          {statusLabels}
        </Flex>
      )}
    </Flex>
  );
};

export default ListSectionHeader;
