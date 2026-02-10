import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { groupBy } from "lodash";
import { FC, useCallback, useMemo } from "react";

import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { AccordionStatus } from "@/redesignComponents/containers/Accordion/types";

import { useTableStatus } from "./hooks";
import TrackingSection from "./TrackingSection";
import { Status, TrackingCollapseGridProps, useEntryTypes, useTrackingLabels } from "./types";

const TrackingCollapseGrid: FC<TrackingCollapseGridProps> = ({ title, domain, type, entries, variant, onChange }) => {
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
  const rowLabel = total === 1 ? rowLabelSingular : rowLabelPlural;
  const user = useIsAdmin();

  const prefix = title == null ? `${t(sectionLabel)} ${t(rowLabel)}` : `${title} - ${t(sectionLabel)} ${t(rowLabel)}`;

  const boldNumber = (
    <Text as="span" fontSize="20px" lineHeight="28px" fontWeight="bold" color="primary.900">
      {total}
    </Text>
  );

  const statusMap: Record<Status, AccordionStatus | undefined> = {
    complete: "complete",
    "not-started": undefined,
    "in-progress": "error"
  };

  return (
    <Accordion
      variant="secondary"
      header={
        <AccordionHeader
          label={prefix}
          title={boldNumber}
          status={statusMap[status]}
          statusLabel={status === "in-progress" ? t("Totals don't match across demographic categories") : undefined}
        />
      }
    >
      <div>
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
                "min-w-80 flex-auto": entryType !== "ethnicity"
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
    </Accordion>
  );
};

export default TrackingCollapseGrid;
