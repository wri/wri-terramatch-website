import { useT } from "@transifex/react";
import classNames from "classnames";
import { groupBy, startCase } from "lodash";
import { FC, useCallback, useMemo, useState } from "react";

import Text from "@/components/elements/Text/Text";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import Icon, { IconNames } from "../Icon/Icon";
import { useTableStatus } from "./hooks";
import TrackingSection from "./TrackingSection";
import { TrackingCollapseGridProps, useEntryTypes, useTrackingLabels } from "./types";

const TrackingCollapseGrid: FC<TrackingCollapseGridProps> = ({ title, domain, type, entries, variant, onChange }) => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const { total, status } = useTableStatus(domain, type, entries);
  const byType = useMemo(() => groupBy(entries, "type"), [entries]);

  const onSectionChange = useCallback(
    (type: string, sectionEntries: TrackingEntryDto[]) => {
      onChange?.([...entries.filter(({ type: entryType }) => entryType !== type), ...sectionEntries]);
    },
    [onChange, entries]
  );

  const entryTypes = useEntryTypes(domain, type);

  const { sectionLabel, rowLabelSingular, rowLabelPlural } = useTrackingLabels(type);
  const rowTitle = t(`${sectionLabel} ${total === 1 ? rowLabelSingular : rowLabelPlural} {total} `, { total });
  const fullTitle = title == null ? rowTitle : `${title} - ${rowTitle}`;
  const user = useIsAdmin();

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={classNames(
          "flex w-full items-center justify-between !rounded-none border-b border-black p-4 px-0",
          {
            [`${variant.open}`]: !open
          },
          variant.header
        )}
      >
        <Text variant="text-16-light">{fullTitle}</Text>

        <div className="flex items-baseline gap-2">
          {onChange != null ? (
            <Text
              as={"div"}
              variant="text-14-bold"
              className={classNames(
                "flex h-fit w-fit items-center justify-center gap-2 rounded-md border px-2 py-1 leading-normal",
                {
                  "border-theme-success-300 bg-theme-success-100 text-theme-success-900": status == "complete",
                  "border-theme-neutral-300 text-theme-neutral-700": status === "not-started",
                  "text-tertiary-450 border-theme-error-300 bg-theme-error-100 text-theme-error-900":
                    status === "in-progress"
                }
              )}
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
          {status === "in-progress" && (
            <p className="text-14-light mb-4 text-theme-error-900">
              {t("The total number of entries must be the same for each category.")}{" "}
              <b>{t("Please review your entries.")}</b>
            </p>
          )}

          <div className={classNames("flex flex-wrap gap-x-16 gap-y-6", { "justify-between": user })}>
            {entryTypes.map(entryType => (
              <div
                key={entryType}
                className={classNames("flex flex-col", {
                  "w-full": entryType === "ethnicity",
                  "min-w-80 max-w-[22rem]": entryType !== "ethnicity"
                })}
              >
                <div
                  className={classNames("shadow-sm grid grid-cols-2 bg-white leading-normal", {
                    "grid-cols-[auto_minmax(10rem,11rem)]": entryType === "ethnicity",
                    "grid-cols-2": entryType !== "ethnicity"
                  })}
                >
                  <TrackingSection
                    domain={domain}
                    trackingType={type}
                    onChange={onChange == null ? undefined : entries => onSectionChange(entryType, entries)}
                    entries={byType[entryType] ?? []}
                    {...{ entryType, variant }}
                    status={status}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TrackingCollapseGrid;
