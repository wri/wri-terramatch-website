import classNames from "classnames";
import { useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import LinearProgressBar from "../ProgressBar/LinearProgressBar/LinearProgressBar";
import Text from "../Text/Text";

export interface FloatNotificationDataProps {
  label: string;
  site: string;
  value: string;
}

export interface FloatNotificationProps {
  data: FloatNotificationDataProps[];
}

const FloatNotification = ({ data }: FloatNotificationProps) => {
  const [openModalNotification, setOpenModalNotification] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <div className="relative">
        <div
          className={classNames(
            "absolute right-[107%] flex max-h-[80vh] w-[460px] flex-col overflow-hidden rounded-xl bg-white shadow-monitored transition-all duration-300",
            { " bottom-[-4px] z-10  opacity-100": openModalNotification },
            { " bottom-[-300px] -z-10  opacity-0": !openModalNotification }
          )}
        >
          <Text variant="text-20-bold" className="border-b border-grey-350 p-6 text-blueCustom-900">
            Notifications
          </Text>
          <div className="flex flex-col overflow-hidden px-6 pb-8 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <Text variant="text-14-light" className="text-neutral-400">
                Actions Taken
              </Text>
              <Text variant="text-12-semibold" className="text-primary">
                Clear completed
              </Text>
            </div>
            <div className="-mr-2 flex flex-1 flex-col gap-3 overflow-auto pr-2">
              {data.map((item, index) => (
                <div key={index} className="rounded-lg border-2 border-grey-350 bg-white p-4 hover:border-primary">
                  <div className="mb-2 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <Text variant="text-14-light" className="leading-[normal] text-darkCustom " as={"span"}>
                      {item.label}
                    </Text>
                  </div>
                  <Text variant="text-14-light" className="text-darkCustom">
                    Site: <b>{item.site}</b>
                  </Text>
                  <div className="mt-2 flex items-center gap-2">
                    <LinearProgressBar value={parseInt(item.value)} className="h-2 bg-success-40" color="success-600" />
                    <Text variant="text-12-semibold" className="text-black">
                      {item.value}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <When condition={data.length > 0}>
          <div className="text-14-bold absolute right-[-5px] top-[-5px] z-20 flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full bg-red-300 leading-[normal] text-white">
            {data.length}
          </div>
        </When>
        <button
          onClick={() => {
            setOpenModalNotification(!openModalNotification);
          }}
          className={classNames(
            "z-10 flex h-15 w-15 items-center justify-center rounded-full border border-grey-950 bg-primary duration-300  hover:scale-105",
            {
              hidden: data.length < 1,
              visible: data.length > 0
            }
          )}
        >
          <Icon
            name={openModalNotification ? IconNames.CLEAR : IconNames.FLOAT_NOTIFICATION}
            className={classNames("text-white", {
              "h-6 w-6": openModalNotification,
              "h-8 w-8": !openModalNotification
            })}
          />
        </button>
      </div>
    </div>
  );
};

export default FloatNotification;
