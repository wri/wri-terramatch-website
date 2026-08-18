import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { groupBy } from "lodash";
import { FC, useCallback, useMemo } from "react";

import { useFrameworkContext } from "@/context/framework.provider";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { AccordionStatus } from "@/redesignComponents/containers/Accordion/types";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import { useTableStatus } from "./hooks";
import TrackingSection from "./TrackingSection";
import { getDefaultEntryConfigs, Status, TrackingCollapseGridProps, useTrackingLabels } from "./types";

const STATUS_MAP: Record<Status, AccordionStatus | undefined> = {
  complete: "complete",
  "not-started": undefined,
  "in-progress": "error"
};

const TrackingCollapseGrid: FC<TrackingCollapseGridProps> = ({
  title,
  entryConfigs: optionalEntryConfigs,
  domain,
  type,
  entries,
  variant,
  onChange
}) => {
  const t = useT();
  const { framework } = useFrameworkContext();
  const entryConfigs = useMemo(
    () =>
      Array.isArray(optionalEntryConfigs) && optionalEntryConfigs.length > 0
        ? optionalEntryConfigs
        : getDefaultEntryConfigs(domain, type, framework),
    [domain, optionalEntryConfigs, framework, type]
  );
  const { total, status, counts } = useTableStatus(entryConfigs, entries);
  const byType = useMemo(() => groupBy(entries, "type"), [entries]);

  const onSectionChange = useCallback(
    (type: string, sectionEntries: TrackingEntryDto[]) => {
      onChange?.([...entries.filter(({ type: entryType }) => entryType !== type), ...sectionEntries]);
    },
    [onChange, entries]
  );

  const { sectionLabel, rowLabelSingular, rowLabelPlural, summaryTotalSingular, summaryTotalPlural } =
    useTrackingLabels(type);
  const rowLabel = total === 1 ? rowLabelSingular : rowLabelPlural;
  const user = useIsAdmin();
  const summaryTotalLabel =
    summaryTotalSingular != null && summaryTotalPlural != null
      ? total === 1
        ? summaryTotalSingular
        : summaryTotalPlural
      : null;
  const composedTotalLabel = `${sectionLabel} ${rowLabel}`;
  const prefix =
    title == null ? summaryTotalLabel ?? composedTotalLabel : `${title} - ${summaryTotalLabel ?? composedTotalLabel}`;

  const boldNumber = (
    <Text as="span" textStyle="600" color="primary.900">
      {`${prefix}: ${formatNumberLocaleString(total)}`}
    </Text>
  );

  const shouldShowError = status === "in-progress";
  const isFormPage = onChange != null;

  return (
    <Accordion
      variant="secondary"
      header={
        <AccordionHeader
          title={boldNumber}
          status={isFormPage ? STATUS_MAP[status] : undefined}
          statusLabel={shouldShowError && isFormPage ? t("Totals don't match across categories") : undefined}
        />
      }
    >
      <div>
        {shouldShowError && isFormPage && (
          <Text textStyle="300" color="error.900" marginBottom={4}>
            {t("The total number of entries must be the same for each category.")}{" "}
            <strong>{t("Please review your entries.")}</strong>
          </Text>
        )}

        <div className={classNames("flex flex-wrap gap-x-16 gap-y-6", { "justify-between": user })}>
          {entryConfigs.map(({ type: entryType }) => {
            const typeDefinition = entryConfigs.find(({ type }) => type === entryType);
            const sectionTotal = counts?.[entryType] ?? 0;

            const isBalanced = typeDefinition?.balanced === true;

            let sectionStatus: Status = "not-started";

            if (shouldShowError && isBalanced) {
              sectionStatus = "in-progress";
            } else if (sectionTotal > 0) {
              sectionStatus = "complete";
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
                    entryConfigs={entryConfigs}
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
