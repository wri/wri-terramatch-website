import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { isCompletedDataOrEstimatedArea } from "@/helpers/polygonValidation";
import { useMessageValidators } from "@/hooks/useMessageValidations";

import { OVERLAPPING_CRITERIA_ID } from "../PolygonDrawer";

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
  clickedRunFixPolygonOverlaps: (value: boolean) => void;
  status: boolean;
}

const PolygonValidation = (props: ICriteriaCheckProps) => {
  const { clickedValidation, clickedRunFixPolygonOverlaps, status, menu } = props;
  const [failedValidationCounter, setFailedValidationCounter] = useState(0);
  const [lastValidationDate, setLastValidationDate] = useState(new Date("1970-01-01"));
  const [hasOverlaps, setHasOverlaps] = useState(false);
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

  const checkHasOverlaps = (validationCriteriaList: ICriteriaCheckItemProps[]) => {
    for (const criteria of validationCriteriaList) {
      if (Number(criteria.id) === OVERLAPPING_CRITERIA_ID && criteria.status === false) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (menu) {
      setHasOverlaps(checkHasOverlaps(menu));
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
      <div className="grid w-[90%] grid-cols-2 gap-2">
        <Button variant="orange" className="mb-4 flex w-full justify-center" onClick={() => clickedValidation(true)}>
          Check Polygon
        </Button>
        <When condition={hasOverlaps}>
          <Button
            variant="orange"
            className="mb-4 flex w-full justify-center border border-black bg-white text-darkCustom-100 hover:border-primary"
            onClick={() => clickedRunFixPolygonOverlaps(true)}
          >
            <span className=" text-10-bold h-min text-darkCustom-100">Fix Polygon</span>
          </Button>
        </When>
      </div>
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
          <div ref={containerRef} className="flex flex-col gap-3 overflow-auto">
            {menu.map(item => (
              <div key={item.id} className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Icon
                    name={
                      item.status
                        ? IconNames.ROUND_GREEN_TICK
                        : isCompletedDataOrEstimatedArea(item)
                        ? IconNames.EXCLAMATION_CIRCLE_FILL
                        : IconNames.ROUND_RED_CROSS
                    }
                    className={classNames("h-4 w-4", {
                      "text-yellow-700": !item.status && isCompletedDataOrEstimatedArea(item)
                    })}
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
