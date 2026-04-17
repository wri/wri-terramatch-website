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
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import { useEntryTypeMap, useEntryTypes, useTableStatus } from "./hooks";
import TrackingSection from "./TrackingSection";
import { Status, TrackingCollapseGridProps, useTrackingLabels } from "./types";

const STATUS_MAP: Record<Status, AccordionStatus | undefined> = {
  complete: "complete",
  "not-started": undefined,
  "in-progress": "error"
};

const TrackingCollapseGrid: FC<TrackingCollapseGridProps> = ({ title, domain, type, entries, variant, onChange }) => {
  const t = useT();
  const { total, status, counts } = useTableStatus(domain, type, entries);
  const byType = useMemo(() => groupBy(entries, "type"), [entries]);

  const onSectionChange = useCallback(
    (type: string, sectionEntries: TrackingEntryDto[]) => {
      onChange?.([...entries.filter(({ type: entryType }) => entryType !== type), ...sectionEntries]);
    },
    [onChange, entries]
  );

  const entryTypes = useEntryTypes(domain, type);
  const entryTypeMap = useEntryTypeMap(domain, type);
  const { sectionLabel, rowLabelSingular, rowLabelPlural } = useTrackingLabels(type);
  const rowLabel = total === 1 ? rowLabelSingular : rowLabelPlural;
  const user = useIsAdmin();
  const prefix = title == null ? `${t(sectionLabel)} ${t(rowLabel)}` : `${title} - ${t(sectionLabel)} ${t(rowLabel)}`;

  const boldNumber = (
    <Text as="span" textStyle="600" color="primary.900">
      {`${prefix}: ${formatNumberLocaleString(total)}`}
    </Text>
  );

  const shouldShowError = status === "in-progress";

  return (
    <Accordion
      variant="secondary"
      header={
        <AccordionHeader
          title={boldNumber}
          status={STATUS_MAP[status]}
          statusLabel={shouldShowError ? t("Totals don't match across categories") : undefined}
        />
      }
    >
      <div>
        {shouldShowError && (
          <Text textStyle="300" color="error.900" marginBottom={4}>
            {t("The total number of entries must be the same for each category.")}{" "}
            <strong>{t("Please review your entries.")}</strong>
          </Text>
        )}

        <div className={classNames("flex flex-wrap gap-x-16 gap-y-6", { "justify-between": user })}>
          {entryTypes.map(entryType => {
            const typeDefinition = entryTypeMap[entryType];
            const sectionTotal = counts?.[entryType] ?? 0;

            let sectionStatus: Status = "not-started";

            if (sectionTotal === 0) {
              sectionStatus = "not-started";
            } else if (!typeDefinition?.balanced) {
              sectionStatus = "complete";
            } else if (sectionTotal === total) {
              sectionStatus = "complete";
            } else if (shouldShowError) {
              sectionStatus = "in-progress";
            }

            return (
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
                    status={sectionStatus}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Accordion>
  );
};

export default TrackingCollapseGrid;
