import { Box, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";

import { ChevronDownAlt } from "@/redesignComponents/foundations/Icons/ChevronDownAlt";
import Avatar, { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

export interface TitleCellProps {
  label: string;
  image?: string;
  icon?: React.ReactNode;
  avatar?: AvatarProps;
  primaryText?: string;
  secondaryText?: string;
  link?: string;
}

const TitleCell: React.FC<TitleCellProps> = ({ label, image, icon, avatar, primaryText, secondaryText, link }) => {
  return (
    <Box
      className={classNames("flex items-baseline gap-2", {
        "!items-center": image != null || icon != null
      })}
    >
      <ChevronDownAlt />
      <Box>
        <Flex gap={2} items-center>
          {image != null && <img src={image} alt={label} className="h-6 w-6 rounded border border-theme-neutral-300" />}
          {icon != null && icon}
          {avatar != null && <Avatar {...avatar} size="small" />}
          <Box>
            <Text
              as={link ? "a" : "p"}
              {...(link == null ? {} : { href: link, target: "_blank" })}
              textStyle="400-bold"
              className="text-theme-neutral-800 underline decoration-theme-primary-700 decoration-dotted underline-offset-4"
            >
              {label}
            </Text>
          </Box>
        </Flex>
        <Flex gap={2} items-center>
          {primaryText != null && (
            <Text textStyle="200" className="text-theme-neutral-700">
              {primaryText}
            </Text>
          )}
          {secondaryText != null && (
            <Text textStyle="200" className="text-theme-neutral-700">
              {secondaryText}
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default TitleCell;
