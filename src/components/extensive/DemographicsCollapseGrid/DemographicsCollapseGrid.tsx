import { useT } from "@transifex/react";
import classNames from "classnames";
import { groupBy, startCase } from "lodash";
import { FC, useCallback, useMemo, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Icon, { IconNames } from "../Icon/Icon";
import DemographicsSection from "./DemographicsSection";
import { useTableStatus } from "./hooks";
import {
  DEMOGRAPHIC_TYPE_MAP,
  DEMOGRAPHIC_TYPES,
  DemographicsCollapseGridProps,
  HBF_DEMOGRAPHIC_TYPE_MAP
} from "./types";

const DemographicsCollapseGrid: FC<DemographicsCollapseGridProps> = ({ title, type, entries, variant, onChange }) => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const { framework } = useFrameworkContext();
  const { total, status } = useTableStatus(entries);
  const byType = useMemo(() => groupBy(entries, "type"), [entries]);

  const onSectionChange = useCallback(
    (type: string, sectionEntries: DemographicEntryDto[]) => {
      onChange?.([...entries.filter(({ type: demographicType }) => demographicType !== type), ...sectionEntries]);
    },
    [onChange, entries]
  );

  const demographicTypes = useMemo(
    () => Object.keys(framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP),
    [framework]
  );

  const { rowLabelSingular, rowLabelPlural } = DEMOGRAPHIC_TYPES[type];
  const rowTitle = t(`{total} ${total === 1 ? rowLabelSingular : rowLabelPlural}`, { total });
  const fullTitle = title == null ? rowTitle : `${title} - ${rowTitle}`;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={classNames("flex w-full items-center justify-between p-4", variant.header, {
          [`${variant.open}`]: !open
        })}
      >
        <Text variant="text-18-bold">{fullTitle}</Text>

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
              "grid w-full gap-x-px gap-y-px border border-neutral-200 bg-neutral-200 leading-normal",
              variant.gridStyle
            )}
          >
            {demographicTypes.map(entryType => (
              <DemographicsSection
                key={entryType}
                demographicType={type}
                onChange={onChange == null ? undefined : entries => onSectionChange(type, entries)}
                entries={byType[entryType] ?? []}
                {...{ entryType, variant }}
              />
            ))}
          </div>
        </div>
      </When>
    </div>
  );
};

export default DemographicsCollapseGrid;
