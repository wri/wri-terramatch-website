import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../Text/Text";

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "success" | "error" | "warning";
  message: string;
  title: string;
}

const Notification: FC<NotificationProps> = props => {
  const { type, message, className, title, ...rest } = props;
  const t = useT();
  const notificationClasses = useMemo(() => {
    const baseClasses =
      "flex items-start rounded-lg font-bold tracking-tighter leading-16 p-4 max-w-[35vw] bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.2)]";
    switch (type) {
      case "success":
        return classNames(baseClasses, "text-bold-body-300 group:text-success-600");
      case "error":
        return classNames(baseClasses, "text-bold-body-300 group:text-error-600");
      case "warning":
        return classNames(baseClasses, "text-bold-body-300 group:text-tertiary-600");
      default:
        return classNames(baseClasses, "text-bold-body-300 group:text-success-600");
    }
  }, [type]);
  const TextClasses = useMemo(() => {
    switch (type) {
      case "success":
        return "text-success-600";
      case "error":
        return "text-error-600";
      case "warning":
        return "text-tertiary-600";
      default:
        return "text-success-600";
    }
  }, [type]);
  return (
    <div {...rest} className={classNames(notificationClasses, className)}>
      <div className="mr-2">
        <When condition={type === "success"}>
          <Icon name={IconNames.IC_SUCCESS} width={24} height={24} />
        </When>
        <When condition={type === "error"}>
          <Icon name={IconNames.IC_ERROR} width={24} height={24} />
        </When>
        <When condition={type === "warning"}>
          <Icon name={IconNames.IC_WARNING} width={24} height={24} />
        </When>
      </div>
      <div>
        <Text variant="text-bold-body-300" className={TextClasses}>
          {t(title)}
        </Text>
        <Text variant="text-body-200" className="mt-2 !font-primary">
          {t(message)}
        </Text>
      </div>
    </div>
  );
};

export default Notification;
