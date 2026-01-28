import { Box, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";

import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import { ChevronDownAlt } from "@/redesignComponents/foundations/Icons/ChevronDownAlt";
import Avatar, { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

export interface TitleCellProps {
  label: string;
  image?: string;
  icon?: React.ReactNode;
  avatar?: AvatarProps;
  primaryText?: string;
  secondaryText?: string;
}

const TitleCell: React.FC<TitleCellProps> = ({ label, image, icon, avatar, primaryText, secondaryText }) => {
  return (
    <Box
      className={classNames("flex items-baseline gap-2", {
        "!items-center": image != null || icon != null
      })}
    >
      <ChevronDownAlt />
      <Box>
        <Flex gap={2} items-center>
          {image != null && <GalleryImage src={image} alt={label} size={24} />}
          {icon != null && icon}
          {avatar != null && <Avatar {...avatar} size="small" />}
          <Box>
            <Text
              fontSize="16px"
              fontWeight="bold"
              className="text-theme-neutral-800 decoration-theme-primary-900 underline decoration-dotted underline-offset-4"
            >
              {label}
            </Text>
          </Box>
        </Flex>
        <Flex gap={2} items-center>
          {primaryText != null && (
            <Text fontSize="12px" className="text-theme-neutral-700">
              {primaryText}
            </Text>
          )}
          {secondaryText != null && (
            <Text fontSize="12px" className="text-theme-neutral-700">
              {secondaryText}
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default TitleCell;
