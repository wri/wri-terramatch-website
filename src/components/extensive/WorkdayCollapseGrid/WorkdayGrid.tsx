import classNames from "classnames";
import { Fragment, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { WorkdayCollapseGridContentProps } from "./WorkdayCollapseGrid";
import { WorkdayGridVariantProps } from "./WorkdayVariant";

export interface WorkdaysGridProps {
  content: WorkdayCollapseGridContentProps[];
  variant: WorkdayGridVariantProps;
  nameSelect?: string;
  daySelect?: string;
}

const WorkdaysGrid = ({ content, variant, nameSelect, daySelect }: WorkdaysGridProps) => {
  const [editEthnicity, setEditEthnicity] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className={classNames("", variant.bodyCollapse)}>
      <div
        className={classNames(
          "overflow-hiden grid w-full gap-x-px gap-y-px border border-neutral-200 bg-neutral-200 leading-normal",
          variant.gridStyle
        )}
      >
        {content.map((contents, index) => (
          <Fragment key={index}>
            <div
              className={classNames("flex items-center justify-center bg-white", variant.firstCol, {
                [`${variant.roundedTl}`]: index === 0,
                [`${variant.roundedBl}`]: index === content.length - 1,
                "row-span-1": contents.item.length === 0,
                "row-span-2": contents.item.length === 1,
                "row-span-3": contents.item.length === 2,
                "row-span-4": contents.item.length === 3,
                "row-span-5": contents.item.length === 4,
                "row-span-6": contents.item.length === 5,
                "row-span-7": contents.item.length === 6,
                "row-span-8": contents.item.length === 7,
                "row-span-full": contents.item.length > 7,
                "!row-span-2": contents.item.length === 0 && contents.type === "Ethnicity",
                "!row-span-3": contents.item.length === 1 && contents.type === "Ethnicity",
                "!row-span-4": contents.item.length === 2 && contents.type === "Ethnicity",
                "!row-span-5": contents.item.length === 3 && contents.type === "Ethnicity",
                "!row-span-6": contents.item.length === 4 && contents.type === "Ethnicity",
                "!row-span-7": contents.item.length === 5 && contents.type === "Ethnicity",
                "!row-span-8": contents.item.length === 6 && contents.type === "Ethnicity",
                "!row-span-full": contents.item.length > 7 && contents.type === "Ethnicity"
              })}
            >
              <Text variant="text-14-light">{contents.type}</Text>
            </div>

            <div className={(classNames("bg-white"), variant.secondCol)}>
              <Text
                variant="text-14-semibold"
                className={classNames("px-4 py-2 text-customBlue-50", variant.columTitle)}
              >
                Total Workdays
              </Text>
            </div>
            <div
              className={classNames("bg-white", variant.tertiaryCol, {
                [`${variant.roundedTr}`]: index === 0,
                "rounded-none": index !== 0
              })}
            >
              <Text
                variant="text-14-semibold"
                className={classNames(
                  "flex items-start justify-center gap-2 px-4 py-2 leading-normal text-customBlue-50",
                  variant.columTitle,
                  { [`${variant.roundedTr}`]: index === 0 }
                )}
              >
                {contents.total}
                <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className={variant.totalIcon} />
              </Text>
            </div>
            {contents.item.map(items => (
              <Fragment key={index}>
                <div className={classNames("flex items-center justify-between bg-white px-4", variant.secondCol)}>
                  <Text variant="text-14-light" className="flex items-center">
                    {items.title}
                  </Text>
                  <When condition={!!editEthnicity && contents.type === "Ethnicity"}>
                    <input
                      placeholder="Enter Ethnicity"
                      className="text-14-light h-min w-3/5 rounded px-2 py-1 outline-0 hover:border hover:border-primary hover:shadow-blue-border-input"
                    />
                  </When>
                </div>
                <div className={classNames("bg-white", variant.tertiaryCol)}>
                  <input
                    key={items.value}
                    defaultValue={items.value}
                    className="text-14-light w-full border border-transparent px-4 py-[9.5px] text-center outline-0 hover:border-primary hover:shadow-blue-border-input"
                  />
                </div>
              </Fragment>
            ))}
            <When condition={!!contents.select}>
              <div className={classNames("flex items-center bg-white", variant.secondCol)}>
                <div className="relative">
                  <button
                    className={
                      "text-14-semibold flex items-baseline gap-1 px-4 py-2 text-customBlue-100 hover:text-primary"
                    }
                    onClick={() => {
                      setOpenMenu(!openMenu);
                    }}
                  >
                    {nameSelect || "Add Ethnic Group"}
                    <Icon
                      name={IconNames.IC_ARROW_COLLAPSE}
                      width={9}
                      height={9}
                      className={classNames("duration-150", { "rotate-180 transform": openMenu })}
                    />
                  </button>
                  <When condition={openMenu}>
                    <div className="absolute rounded-lg border border-neutral-200 bg-white p-2">
                      <button
                        className="w-full rounded-lg p-2 text-left hover:bg-customBlue-75 hover:text-primary"
                        onClick={() => setEditEthnicity(!editEthnicity)}
                      >
                        Indigenous
                      </button>
                      <button
                        className="w-full rounded-lg p-2 text-left hover:bg-customBlue-75 hover:text-primary"
                        onClick={() => setEditEthnicity(!editEthnicity)}
                      >
                        Other
                      </button>
                      <button
                        className="w-full rounded-lg p-2 text-left hover:bg-customBlue-75 hover:text-primary"
                        onClick={() => setEditEthnicity(!editEthnicity)}
                      >
                        Unknown
                      </button>
                    </div>
                  </When>
                </div>
              </div>
              <div className={classNames("bg-white", variant.roundedBr, variant.tertiaryCol)}>
                <input
                  className={classNames(
                    "text-14-light w-full border border-transparent px-4 py-[9.5px] text-center outline-0 hover:border-primary hover:shadow-blue-border-input",
                    variant.roundedBr
                  )}
                  defaultValue={daySelect}
                />
              </div>
            </When>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkdaysGrid;
