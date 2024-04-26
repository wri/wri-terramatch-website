import classNames from "classnames";
import { FC, Fragment, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";

export interface WorkdayCollapseTableItemProps {
  title: string;
  value: string;
}

export interface WorkdayCollapseTableContentProps {
  type: "Gender" | "Age" | "Ethnicity";
  item: WorkdayCollapseTableItemProps[];
  total: string;
}

export interface WorkdayCollapseTableProps {
  title: string;
  status: "Complete" | "Not Started" | "In Progress";
  content: WorkdayCollapseTableContentProps[];
}

const WorkdayCollapseTable: FC<WorkdayCollapseTableProps> = ({ title, status, content, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [editEthnicity, setEditEthnicity] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={classNames("flex w-full items-center justify-between rounded-t-2xl bg-customGreen-100 p-4", {
          "rounded-b-2xl": !open
        })}
      >
        <Text variant="text-18-bold">{title}</Text>
        <div className="flex items-baseline gap-2">
          <Text
            variant="text-14-bold"
            className={classNames("flex items-start gap-2 leading-normal", {
              "text-customGreen-200": status === "Complete",
              "text-neutral-550": status === "Not Started",
              "text-tertiary-450": status === "In Progress"
            })}
          >
            {status}
            <When condition={status === "Complete"}>
              <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className="text-customGreen-200" />
            </When>
          </Text>

          <Icon
            name={IconNames.IC_ARROW_COLLAPSE}
            width={16}
            height={9}
            className={classNames("text-customGreen-300", { "rotate-180 transform": open })}
          />
        </div>
      </button>
      <When condition={open}></When>
      <div className="bg-neutral-75 px-4 py-5">
        <div className="overflow-hiden grid w-full grid-cols-15 gap-x-px gap-y-px rounded-2xl border border-neutral-200 bg-neutral-200 leading-normal">
          {content.map((contents, index) => (
            <Fragment key={index}>
              <div
                className={classNames("row-span-5 col-span-4 flex items-center justify-center bg-white", {
                  "rounded-tl-2xl": index === 0,
                  "rounded-bl-2xl": index === content.length - 1,
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

              <div className="col-span-7 bg-white">
                <Text variant="text-14-semibold" className="bg-neutral-450 px-4 py-2 text-customBlue-50">
                  Total Workdays {index}
                </Text>
              </div>
              <div
                className={classNames("col-span-4 bg-neutral-450", {
                  "rounded-tr-2xl": index === 0,
                  "rounded-none": index !== 0
                })}
              >
                <Text
                  variant="text-14-semibold"
                  className="flex items-start justify-center gap-2 px-4 py-2 leading-normal text-customBlue-50"
                >
                  {contents.total}
                  <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className="text-customGreen-200" />
                </Text>
              </div>
              {contents.item.map(items => (
                <Fragment key={index}>
                  <div className="col-span-7 flex items-center justify-between bg-white">
                    <Text variant="text-14-light" className="flex items-center px-4">
                      {items.title}
                    </Text>
                    <When condition={!!editEthnicity && contents.type === "Ethnicity"}>
                      <input
                        placeholder="Enter Ethnicity"
                        className="text-14-light h-min w-3/5 rounded px-2 py-1 outline-0 hover:border hover:border-primary hover:shadow-blue-border-input"
                      />
                    </When>
                  </div>
                  <div className="col-span-4 bg-white">
                    <input
                      key={items.value}
                      defaultValue={items.value}
                      className="text-14-light w-full border border-transparent px-4 py-[9.5px] text-center outline-0 hover:border-primary hover:shadow-blue-border-input"
                    />
                  </div>
                </Fragment>
              ))}
              <When condition={contents.type === "Ethnicity"}>
                <div className="relative col-span-7 bg-white">
                  <button
                    className={"text-14-semibold flex items-baseline gap-1 px-4 py-2 text-customBlue-100"}
                    onClick={() => {
                      setOpenMenu(!openMenu);
                    }}
                  >
                    Add Ethnic Group{" "}
                    <Icon
                      name={IconNames.IC_ARROW_COLLAPSE}
                      width={9}
                      height={9}
                      className={classNames({ "rotate-180 transform": openMenu })}
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
                <div className="col-span-4 rounded-br-2xl bg-white">
                  <input className="text-14-light w-full rounded-br-2xl border border-transparent px-4 py-[9.5px] text-center outline-0 hover:border-primary hover:shadow-blue-border-input" />
                </div>
              </When>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkdayCollapseTable;
