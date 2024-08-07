import React, { useEffect, useRef, useState } from "react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useMessageValidators } from "@/hooks/useMessageValidations";

export interface ICriteriaCheckItemProps {
  id: string;
  status: boolean;
  label: string;
  date?: string;
  extra_info?: string;
}

export interface ICriteriaCheckProps {
  menu: ICriteriaCheckItemProps[];
  clickedValidation: (value: boolean) => void;
  status: boolean;
}

const PolygonValidation = (props: ICriteriaCheckProps) => {
  const { clickedValidation, status, menu } = props;
  const [failedValidationCounter, setFailedValidationCounter] = useState(0);
  const [lastValidationDate, setLastValidationDate] = useState(new Date("1970-01-01"));
  const containerRef = useRef<HTMLDivElement>(null);
  const { getFormatedExtraInfo } = useMessageValidators();
  const formattedDate = (dateObject: Date) => {
    const localDate = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60000);
    return `${localDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })} on ${localDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    })}`;
  };

  useEffect(() => {
    if (menu) {
      const lastValidationDate = menu.reduce((latestDate, record) => {
        const currentDate = record.date ? new Date(record.date) : null;
        return currentDate && currentDate > latestDate ? currentDate : latestDate;
      }, new Date("1970-01-01"));
      setLastValidationDate(lastValidationDate);

      const failedValidationCounter = menu.reduce((count, record) => {
        return record.status === false ? count + 1 : count;
      }, 0);
      setFailedValidationCounter(failedValidationCounter);
    }
  }, [menu]);

  return (
    <div>
      <Button variant="orange" className="mb-4 px-10" onClick={() => clickedValidation(true)}>
        Check Polygon
      </Button>
      <If condition={status}>
        <Then>
          <div className="mb-1 flex items-center">
            <Text variant="text-14-bold" className="text-darkCustom">
              {`${failedValidationCounter} out of ${menu.length}`} &nbsp;
            </Text>
            <Text variant="text-14" className="text-darkCustom">
              criteria are not met
            </Text>
          </div>
          <Text variant="text-10-light" className="mb-4 text-blueCustom-900 opacity-80">
            Last check at {formattedDate(lastValidationDate)}
          </Text>
          <div ref={containerRef} className="flex max-h-[168px] flex-col gap-3 overflow-auto">
            {menu.map(item => (
              <div key={item.id} className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Icon
                    name={item.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS}
                    className="h-4 w-4"
                  />
                  <Text variant="text-14-light">{item.label}</Text>
                </div>
                {item.extra_info &&
                  getFormatedExtraInfo(item.extra_info, item.id).map((info: string) => (
                    <div className="flex items-start gap-[6px] pl-6" key={info}>
                      <div className="mt-[3px] flex items-start lg:mt-[4px] wide:mt-[6px]">
                        <span className="text-[7px] text-blueCustom-900 opacity-80">&#9679;</span>
                      </div>
                      <Text variant="text-10-light" className=" text-blueCustom-900 opacity-80">
                        {info}
                      </Text>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Then>
        <Else>
          <Text variant="text-14" className="text-darkCustom">
            No criteria checked yet
          </Text>
        </Else>
      </If>
    </div>
  );
};

export default PolygonValidation;
