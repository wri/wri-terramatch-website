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
      <When condition={open}>
        <div className="bg-neutral-75 px-4 py-5">
          <div className="overflow-hiden grid max-w-full grid-cols-15 gap-x-px gap-y-px rounded-2xl border border-neutral-200 bg-neutral-200 leading-normal">
            {content.map((contents, index) => (
              <Fragment key={index}>
                <div className="col-span-4 flex items-center justify-center bg-white">
                  <Text variant="text-14-light">{contents.type}</Text>
                </div>
                <div className="col-span-7 bg-white">
                  <Text
                    variant="text-14-semibold"
                    className="border-b border-neutral-200 bg-neutral-450 px-4 py-2 text-customBlue-50"
                  >
                    Total Workdays
                  </Text>
                  {contents.item.map(items => (
                    <div className="flex justify-between border-b border-neutral-200 px-4 py-1" key={items.title}>
                      <Text variant="text-14-light" className="py-1.5">
                        {items.title}
                      </Text>
                      <When condition={!!editEthnicity && contents.type === "Ethnicity"}>
                        <input
                          placeholder="Enter Ethnicity"
                          className="text-14-light w-3/5 rounded px-2 py-1 outline-0 hover:border hover:border-primary hover:shadow-blue-border-input"
                        />
                      </When>
                    </div>
                  ))}
                  <When condition={contents.type === "Ethnicity"}>
                    <div className="relative">
                      <button
                        className="text-14-semibold flex items-baseline gap-1 px-4 py-2 text-customBlue-100"
                        onClick={() => {
                          setOpenMenu(!openMenu);
                        }}
                      >
                        Add Ethnic Group{" "}
                        <Icon
                          name={IconNames.IC_ARROW_COLLAPSE}
                          width={9}
                          height={9}
                          className={classNames("", { "rotate-180 transform": open })}
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
                  </When>
                </div>
                <div className="col-span-4 bg-white">
                  <Text
                    variant="text-14-semibold"
                    className="flex items-start justify-center gap-2 border-b border-neutral-200 bg-neutral-450 px-4 py-2 leading-normal text-customBlue-50"
                  >
                    {contents.total}
                    <When condition={status === "Complete"}>
                      <Icon
                        name={IconNames.ROUND_CUSTOM_TICK}
                        width={16}
                        height={16}
                        className="text-customGreen-200"
                      />
                    </When>
                  </Text>
                  {contents.item.map(items => (
                    <input
                      key={items.value}
                      defaultValue={items.value}
                      className="text-14-light w-full border border-b border-transparent border-b-neutral-200 px-4 py-[9.5px] text-center outline-0 hover:border-primary hover:shadow-blue-border-input"
                    />
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </When>
    </div>
  );
};

export default WorkdayCollapseTable;
