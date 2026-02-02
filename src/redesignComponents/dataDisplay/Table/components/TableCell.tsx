import { Box, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";

import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import { ProgressTag, ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { Jobs, Tree } from "@/redesignComponents/foundations/Icons";
import Avatar, { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

export interface TableCellProps {
  label?: string;
  avatars?: AvatarProps[];
  primaryText?: string;
  secondaryText?: string;
  progressTag?: ProgressTagProps;
  trees?: string;
  jobs?: string;
  multiActionButton?: IMultiActionButtonProps;
}

const TableCell: React.FC<TableCellProps> = ({
  avatars,
  primaryText,
  secondaryText,
  progressTag,
  trees,
  jobs,
  multiActionButton
}) => {
  const visibleAvatars = avatars != null ? avatars.slice(0, 2) : [];
  const extraAvatarsCount = avatars != null && avatars.length > 2 ? avatars.length - 2 : 0;

  return (
    <Box className={classNames("flex items-center gap-2")}>
      <Box>
        <Flex alignItems="center" gap={2}>
          <Flex>
            {visibleAvatars.map(avatar => (
              <div key={avatar.name} className="h-6 w-4">
                <div className="absolute z-10">
                  <Avatar key={avatar.name} {...avatar} size="small" />
                </div>
              </div>
            ))}
          </Flex>

          {extraAvatarsCount > 0 && (
            <Box className="ml-2 text-xs font-semibold text-theme-neutral-800">+{extraAvatarsCount}</Box>
          )}
          {progressTag != null && <ProgressTag {...progressTag} />}
          {trees != null && (
            <Flex>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-theme-neutral-100 bg-theme-secondary-300">
                <Tree className="text-theme-secondary-800" />
              </div>
              <Text fontSize="16px" className="text-theme-neutral-700">
                {trees}
              </Text>
            </Flex>
          )}
          {jobs != null && (
            <Flex>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-theme-neutral-100 bg-theme-primary-300">
                <Jobs className="text-theme-primary-800" />
              </div>
              <Text fontSize="16px" className="text-theme-neutral-700">
                {jobs}
              </Text>
            </Flex>
          )}
          {multiActionButton != null && (
            <MultiActionButton
              variant={multiActionButton.variant}
              size={multiActionButton.size}
              mainActionLabel={multiActionButton.mainActionLabel}
              mainActionOnClick={multiActionButton.mainActionOnClick}
              otherActions={multiActionButton.otherActions}
              disabled={multiActionButton.disabled}
              className={multiActionButton.className}
            />
          )}
        </Flex>
        <Flex gap={2} alignItems="center">
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

export default TableCell;
