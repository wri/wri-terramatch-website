import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../Text/Text";

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "success" | "error" | "warning";
  message: string;
  title: string;
  open: boolean;
}

const Notification: FC<NotificationProps> = props => {
  const { type = "default", message, className, title, open, ...rest } = props;
  const t = useT();
  const [openNotification, setOpenNotification] = useState(open);

  const notificationClasses = useMemo(() => {
    const baseClasses =
      "flex items-start rounded-lg font-bold w-full tracking-tighter leading-16 p-4 bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.2)]";
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

  const textClasses = useMemo(() => {
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

  useEffect(() => {
    setOpenNotification(open);
  }, [open]);

  const closeNotification = () => {
    setOpenNotification(false);
  };

  return (
    <div className="fixed top-[86px] right-[1.5vw] z-[1000000] flex w-[28vw] shadow-black">
      {openNotification ? (
        <>
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
            <div className="w-full">
              <div>
                <Text variant="text-bold-body-300" className={tw("w-full", textClasses)}>
                  <button onClick={closeNotification} className="float-right text-neutral-400 hover:opacity-60">
                    <Icon name={IconNames.CLEAR} className={tw("h-3 w-3 lg:h-4 lg:w-4 wide:h-5 wide:w-5")} />
                  </button>
                  {t(title)}
                </Text>
              </div>
              <When condition={!!message}>
                <Text variant="text-body-200" className="mt-2 !font-primary">
                  {t(message)}
                </Text>
              </When>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Notification;
