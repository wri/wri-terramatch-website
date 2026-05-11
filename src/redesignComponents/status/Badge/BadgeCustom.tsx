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
  size?: "small" | "big";
}

const Badge = ({
  hasNotification = true,
  notificationCount,
  label,
  labelClassName,
  children,
  color,
  className,
  size = "small"
}: BadgeProps) => {
  const getNotificationCount = () => {
    let notification = "";
    if (notificationCount && notificationCount > 0) {
      notification = `${notificationCount > 99 ? "99+" : notificationCount}`;
    }

    return notification;
  };

  const notification = getNotificationCount();

  const defaultChildren = <NotificationIcon color="currentColor" className="h-4 w-4" />;

  return (
    <Flex
      role="status"
      aria-live="polite"
      color={color}
      className={twMerge("items-center justify-start gap-2", className)}
    >
      <Flex className="relative flex">
        {notification.length > 0 && hasNotification ? (
          <div className="bg-theme-error-500 absolute -top-1 left-2 flex items-center justify-center rounded-full px-1 py-0.5">
            <Text textStyle={size === "small" ? "50-bold" : "300-bold"}>{notification}</Text>
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
