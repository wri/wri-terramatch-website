import { useT } from "@transifex/react";
import classNames from "classnames";
import { groupBy, startCase } from "lodash";
import { FC, useMemo, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { useTableStatus } from "./hooks";
import { DEMOGRAPHIC_TYPES, WorkdayCollapseGridProps } from "./types";
import WorkdaySection from "./WorkdaySection";

const WorkdayCollapseGrid: FC<WorkdayCollapseGridProps> = ({ title, demographics, variant, onChange }) => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const { total, status } = useTableStatus(demographics);
  const byType = useMemo(() => groupBy(demographics, "type"), [demographics]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={classNames("flex w-full items-center justify-between p-4", variant.header, {
          [`${variant.open}`]: !open
        })}
      >
        <Text variant="text-18-bold">
          {t(title)} - {t("{total} Days", { total })}
        </Text>

        <div className="flex items-baseline gap-2">
          <When condition={onChange != null}>
            <Text
              variant="text-14-bold"
              className={classNames("flex items-start gap-2 leading-normal", {
                "text-customGreen-200": status === "complete",
                "text-neutral-550": status === "not-started",
                "text-tertiary-450": status === "in-progress"
              })}
            >
              {t(startCase(status))}
              <When condition={status === "complete"}>
                <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className="text-customGreen-200" />
              </When>
            </Text>
          </When>
          <Icon
            name={IconNames.IC_ARROW_COLLAPSE}
            width={16}
            height={9}
            className={classNames("text-customGreen-300 duration-150", { "rotate-180 transform": open })}
          />
        </div>
      </button>
      <When condition={open}>
        <div className={classNames("", variant.bodyCollapse)}>
          <div
            className={classNames(
              "overflow-hiden grid w-full gap-x-px gap-y-px border border-neutral-200 bg-neutral-200 leading-normal",
              variant.gridStyle
            )}
          >
            {DEMOGRAPHIC_TYPES.map(type => (
              <WorkdaySection key={type} demographics={byType[type] ?? []} {...{ type, variant, onChange }} />
            ))}
          </div>
        </div>
      </When>
    </div>
  );
};

export default WorkdayCollapseGrid;
