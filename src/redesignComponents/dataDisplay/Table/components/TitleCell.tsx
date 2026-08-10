import { Box, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";

import { ChevronDownAltIcon } from "@/redesignComponents/foundations/Icons";
import Avatar, { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

export interface TitleCellProps {
  label: string;
  image?: string;
  icon?: React.ReactNode;
  avatar?: AvatarProps;
  primaryText?: string;
  secondaryText?: string;
  link?: string;
  linkTarget?: "_blank" | "_self";
  showChevron?: boolean;
}

const TitleCell: React.FC<TitleCellProps> = ({
  label,
  image,
  icon,
  avatar,
  primaryText,
  secondaryText,
  link,
  linkTarget = "_blank",
  showChevron = true
}) => {
  return (
    <Box
      className={classNames("flex items-baseline gap-2", {
        "!items-center": image != null || icon != null
      })}
    >
      {showChevron && <ChevronDownAltIcon />}
      <Box>
        <Flex gap={2} items-center>
          {image != null && <img src={image} alt={label} className="h-6 w-6 rounded border border-theme-neutral-300" />}
          {icon != null && icon}
          {avatar != null && <Avatar {...avatar} size="small" />}
          <Box>
            <Text
              as={link ? "a" : "p"}
              {...(link == null ? {} : { href: link, target: linkTarget })}
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
