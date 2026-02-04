import { useT } from "@transifex/react";
import classNames from "classnames";
import { groupBy, startCase } from "lodash";
import { FC, useCallback, useMemo, useState } from "react";

import Text from "@/components/elements/Text/Text";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Icon, { IconNames } from "../Icon/Icon";
import { useTableStatus } from "./hooks";
import TrackingSection from "./TrackingSection";
import { TrackingCollapseGridProps, useEntryTypes, useTrackingLabels } from "./types";

const TrackingCollapseGrid: FC<TrackingCollapseGridProps> = ({ title, type, entries, variant, onChange }) => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const { total, status } = useTableStatus(type, entries);
  const byType = useMemo(() => groupBy(entries, "type"), [entries]);

  const onSectionChange = useCallback(
    (type: string, sectionEntries: TrackingEntryDto[]) => {
      onChange?.([...entries.filter(({ type: entryType }) => entryType !== type), ...sectionEntries]);
    },
    [onChange, entries]
  );

  const entryTypes = useEntryTypes(type);

  const { sectionLabel, rowLabelSingular, rowLabelPlural } = useTrackingLabels(type);
  const rowTitle = t(`{total} ${sectionLabel} ${total === 1 ? rowLabelSingular : rowLabelPlural}`, { total });
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
          {onChange != null ? (
            <Text
              as={"div"}
              variant="text-14-bold"
              className={classNames("flex items-start gap-2 leading-normal", {
                "text-customGreen-200": status === "complete",
                "text-neutral-550": status === "not-started",
                "text-tertiary-450": status === "in-progress"
              })}
            >
              {t(startCase(status))}
              {status === "complete" ? (
                <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className="text-customGreen-200" />
              ) : null}
            </Text>
          ) : null}
          <Icon
            name={IconNames.IC_ARROW_COLLAPSE}
            width={16}
            height={9}
            className={classNames("text-customGreen-300 duration-150", { "rotate-180 transform": open })}
          />
        </div>
      </button>
      {open ? (
        <div className={classNames("", variant.bodyCollapse)}>
          <div
            className={classNames(
              "grid w-full gap-x-px gap-y-px border border-neutral-200 bg-neutral-200 leading-normal",
              variant.gridStyle
            )}
          >
            {entryTypes.map(entryType => (
              <TrackingSection
                key={entryType}
                trackingType={type}
                onChange={onChange == null ? undefined : entries => onSectionChange(entryType, entries)}
                entries={byType[entryType] ?? []}
                {...{ entryType, variant }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TrackingCollapseGrid;
