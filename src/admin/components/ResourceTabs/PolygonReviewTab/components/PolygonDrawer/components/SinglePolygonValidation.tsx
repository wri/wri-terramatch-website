import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { usePolygonValidation } from "@/connections/Validation";
import { parseV3ValidationData, shouldShowAsWarning } from "@/helpers/polygonValidation";
import { useMessageValidators } from "@/hooks/useMessageValidations";
import { ICriteriaCheckItem, OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonFixability, PolygonFixabilityResult } from "@/utils/polygonFixValidation";

export interface ICriteriaCheckItemProps extends ICriteriaCheckItem {}

export interface ICriteriaCheckProps {
  polygonUuid: string;
  clickedValidation: (value: boolean) => void;
  clickedRunFixPolygonOverlaps: (value: boolean) => void;
}

const SinglePolygonValidation = (props: ICriteriaCheckProps) => {
  const { clickedValidation, clickedRunFixPolygonOverlaps, polygonUuid } = props;
  const [failedValidationCounter, setFailedValidationCounter] = useState(0);
  const [lastValidationDate, setLastValidationDate] = useState(new Date("1970-01-01"));
  const [hasOverlaps, setHasOverlaps] = useState(false);
  const [menu, setMenu] = useState<ICriteriaCheckItemProps[]>([]);
  const [status, setStatus] = useState(false);
  const [fixabilityResult, setFixabilityResult] = useState<PolygonFixabilityResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getFormatedExtraInfo } = useMessageValidators();

  const v3ValidationData = usePolygonValidation({
    polygonUuid
  });

  useEffect(() => {
    if (v3ValidationData?.criteriaList && v3ValidationData.criteriaList.length > 0) {
      const processedMenu = parseV3ValidationData(v3ValidationData);
      setMenu(processedMenu);
      setStatus(true);
    } else {
      setMenu([]);
      setStatus(false);
    }
  }, [v3ValidationData]);

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

      const overlapCriteria = menu.find(item => Number(item.id) === OVERLAPPING_CRITERIA_ID && !item.status);
      if (overlapCriteria && overlapCriteria.extra_info && Array.isArray(overlapCriteria.extra_info)) {
        const result = checkPolygonFixability(overlapCriteria.extra_info);
        setFixabilityResult(result);
      } else {
        setFixabilityResult(null);
      }
    }
  }, [menu]);

  return (
    <div>
      <div className="w-[90%]">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button variant="orange" className="flex w-full justify-center" onClick={() => clickedValidation(true)}>
            Check Polygon
          </Button>
          <When condition={hasOverlaps}>
            <Button
              variant="orange"
              className="flex w-full justify-center border border-black bg-white text-darkCustom-100 hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => clickedRunFixPolygonOverlaps(true)}
              disabled={fixabilityResult != null && !fixabilityResult.canBeFixed}
              title={
                fixabilityResult != null
                  ? fixabilityResult.canBeFixed
                    ? "This polygon can be fixed automatically"
                    : fixabilityResult.reasons.join(". ")
                  : "Checking fixability..."
              }
            >
              <span className=" text-10-bold h-min text-darkCustom-100">Fix Polygon</span>
            </Button>
          </When>
        </div>
        <When condition={hasOverlaps && fixabilityResult != null && fixabilityResult.reasons.length > 0}>
          <div className="mb-4">
            <Text variant="text-10-semibold" className="mb-2 text-darkCustom">
              Fix Polygon Notes:
            </Text>
            <div className="bg-gray-50 rounded p-2">
              <Text variant="text-8-light" className="text-gray-700">
                {fixabilityResult?.canBeFixed
                  ? "✓ Meets all fixable criteria (≤3.5% overlap, ≤0.1 ha area)"
                  : `✗ ${fixabilityResult?.reasons.join(". ")}`}
              </Text>
            </div>
          </div>
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
                        : shouldShowAsWarning(item)
                        ? IconNames.EXCLAMATION_CIRCLE_FILL
                        : IconNames.ROUND_RED_CROSS
                    }
                    className={classNames("h-4 w-4", {
                      "text-yellow-700": !item.status && shouldShowAsWarning(item)
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

export default SinglePolygonValidation;
