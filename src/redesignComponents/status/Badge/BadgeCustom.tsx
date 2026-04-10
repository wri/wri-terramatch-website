import { Flex, Text } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

import { NotificationIcon } from "@/redesignComponents/foundations/Icons";

interface BadgeProps {
  hasNotification: boolean;
  notificationCount: number;
  label?: string;
  labelClassName?: string;
  children: React.ReactNode;
  color?: string;
  className?: string;
}

const Badge = ({
  hasNotification = true,
  notificationCount,
  label,
  labelClassName,
  children,
  color,
  className
}: BadgeProps) => {
  const getNotificationCount = () => {
    let notification = "";
    if (notificationCount && notificationCount > 0) {
      notification = `${notificationCount > 99 ? "99+" : notificationCount}`;
    }

    return notification;
  };

  const notification = getNotificationCount();

  const defaultChildren = <NotificationIcon color="currentColor" height="16px" width="16px" />;

  return (
    <Flex
      role="status"
      aria-live="polite"
      color={color}
      className={twMerge("items-center justify-start gap-2", className)}
    >
      <Flex className="relative flex">
        {notification.length > 0 && hasNotification ? (
          <div className="absolute -top-2 left-2 flex items-center justify-center rounded-full bg-theme-error-500 px-1">
            <Text textStyle="300-bold">{notification}</Text>
          </div>
        ) : null}
        {children ?? defaultChildren}
      </Flex>
      {label ? (
        <Text textStyle="400" className={labelClassName}>
          {label}
        </Text>
      ) : null}
    </Flex>
  );
};

export default Badge;
