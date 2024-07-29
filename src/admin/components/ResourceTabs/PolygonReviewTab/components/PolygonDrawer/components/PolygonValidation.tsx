import React, { useEffect, useRef, useState } from "react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";

export interface ICriteriaCheckItemProps {
  id: string;
  status: boolean;
  label: string;
  date?: string;
  extra_info?: string;
}

const fieldsToValidate: any = {
  poly_name: "Polygon Name",
  plantstart: "Plant Start",
  plantend: "Plant End",
  practice: "Restoration Practice",
  target_sys: "Target Land Use System",
  distr: "Tree Distribution",
  num_trees: "Number of Trees"
};

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

  const getFormattedExtraInfo = (extraInfo: string | undefined) => {
    if (!extraInfo) return [];

    try {
      const infoArray = JSON.parse(extraInfo);
      return infoArray
        .map((info: any) => {
          if (info.exists === false) {
            return `${fieldsToValidate[info.field]} is missing.`;
          } else if (info.exists === true && info.error === "target_sys") {
            return `${fieldsToValidate[info.field]}: ${info.error} is not a valid ${
              fieldsToValidate[info.field]
            } because it is not one of [“agroforest”, “natural-forest”, “mangrove”, “peatland”, “riparian-area-or-wetland”, “silvopasture”, “woodlot-or-plantation”, “urban-forest”].`;
          } else if (info.exists === true && info.error === "distr") {
            return `${fieldsToValidate[info.field]}: ${info.error} is not a valid ${
              fieldsToValidate[info.field]
            } because it is not one of [“single-line”, “partial”, “full”].`;
          } else if (info.exists === true && info.error === "num_trees") {
            return `${fieldsToValidate[info.field]}: ${info.error} is not a valid ${
              fieldsToValidate[info.field]
            } because it is not an integer.`;
          } else if (info.exists === true && info.error === "practice") {
            return `${fieldsToValidate[info.field]}: ${info.error} is not a valid ${
              fieldsToValidate[info.field]
            } because it is not one of [“tree-planting”, “direct-seeding“, “assisted-natural-regeneration”].`;
          }
          return null;
        })
        .filter((message: string | null) => message !== null);
    } catch {
      return ["Error parsing extra info."];
    }
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
                  getFormattedExtraInfo(item.extra_info).map((info: any, index: number) => (
                    <Text key={index} variant="text-14-light">
                      {info}
                    </Text>
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
