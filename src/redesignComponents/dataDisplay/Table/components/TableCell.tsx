import { Box, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";

import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import { ProgressTag, ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import Avatar, { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

import MetricIcon from "../../Metrics/MetricIcon";

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
  const isSingleAvatar = avatars != null && avatars.length === 1;

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

          {isSingleAvatar && visibleAvatars[0]?.name != null && (
            <Text textStyle="400" fontWeight="bold" className="ml-2 text-theme-neutral-800">
              {visibleAvatars[0].name}
            </Text>
          )}

          {extraAvatarsCount > 0 && (
            <Box className="ml-2 text-xs font-semibold text-theme-neutral-800">+{extraAvatarsCount}</Box>
          )}
          {progressTag != null && <ProgressTag {...progressTag} />}
          {trees != null && (
            <Flex gap={1} items-center>
              <MetricIcon type="trees" />
              <Text textStyle="400" className="leading-[28px] text-theme-neutral-800">
                {trees}
              </Text>
            </Flex>
          )}
          {jobs != null && (
            <Flex gap={2}>
              <MetricIcon type="jobs" />
              <Text textStyle="400" className="leading-[28px] text-theme-neutral-800">
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

export default TableCell;
