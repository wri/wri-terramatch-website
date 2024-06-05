import { useT } from "@transifex/react";
import classNames from "classnames";
import { has } from "lodash";
import { FC, useMemo } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../Text/Text";
import { TYPE_CLASSES } from "./constants/baseClasses";
import { TEXT_CLASSES } from "./constants/textClasses";

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "success" | "error" | "warning";
  message: string;
  title: string;
}

const Notification: FC<NotificationProps> = props => {
  const { type = "default", message, className, title, ...rest } = props;
  const t = useT();

  const textClasses = useMemo(() => (has(TEXT_CLASSES, type) ? TEXT_CLASSES[type] : TEXT_CLASSES.default), [type]);

  const notificationClasses = useMemo(
    () => (has(TYPE_CLASSES, type) ? TYPE_CLASSES[type] : TYPE_CLASSES.default),
    [type]
  );

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
        <Text variant="text-bold-body-300" className={textClasses}>
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
