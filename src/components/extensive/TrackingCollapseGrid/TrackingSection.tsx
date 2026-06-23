import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { sortBy } from "lodash";
import { FC, useCallback, useMemo } from "react";

import TrackingRow from "@/components/extensive/TrackingCollapseGrid/TrackingRow";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";

import { useSectionData } from "./hooks";
import { Status, TrackingDomain, TrackingEntryConfig, TrackingType } from "./types";

export interface TrackingSectionProps {
  entryConfigs: TrackingEntryConfig[];
  domain: TrackingDomain;
  trackingType: TrackingType;
  entryType: string;
  entries: TrackingEntryDto[];
  onChange?: (entries: TrackingEntryDto[]) => void;
  onBlur?: () => void;
  status?: Status;
}

const TrackingSection: FC<TrackingSectionProps> = ({
  entryConfigs,
  domain,
  trackingType,
  entryType,
  entries,
  onBlur,
  onChange,
  status
}) => {
  const t = useT();
  const { title, rows, total, displayTrackingType } = useSectionData(entryConfigs, trackingType, entryType, entries);
  const { addNameLabel, subTypes } = useMemo(() => {
    const entryConfig = entryConfigs.find(({ type }) => type === entryType);
    if (entryConfig == null) throw new Error(`Entry config for section not found [${entryType}]`);
    return entryConfig;
  }, [entryConfigs, entryType]);

  const onRowChange = useCallback(
    (index: number, subtype: string, amount: number, userLabel?: string) => {
      if (onChange == null) return;

      // avoid mutation of existing data from our parent
      const updatedEntries = [...entries];
      const entry: TrackingEntryDto =
        index >= 0
          ? { ...updatedEntries[index] }
          : // We can ignore name here because when a type uses names, we never have a row
            // that doesn't exist in the entries array, so the index can never be < 0
            { type: entryType, subtype, amount };

      if (userLabel != null) {
        entry.name = userLabel;
      }
      entry.amount = amount;
      if (index < 0) {
        updatedEntries.push(entry);
      } else {
        updatedEntries[index] = entry;
      }

      onChange(updatedEntries);
    },
    [entries, entryType, onChange]
  );

  const addRow = useCallback(
    (subtype: string) => {
      onChange?.([...entries, { type: entryType, subtype, amount: 0 }]);
    },
    [entries, entryType, onChange]
  );

  const addNameButton = useMemo(() => {
    if (addNameLabel == null || onChange == null) return null;

    return (
      <div className={classNames("flex items-center py-3", "col-span-2 border-b border-neutral-200 bg-white")}>
        <MultiActionButton
          mainActionLabel={t(addNameLabel)}
          mainActionOnClick={() => {}}
          otherActions={sortBy(subTypes, ({ label }) => t(label)).map(({ subtype, label }) => ({
            label: t(label),
            onClick: () => addRow(subtype),
            value: subtype
          }))}
          size="small"
          variant="secondary"
        />
      </div>
    );
  }, [addNameLabel, addRow, onChange, subTypes, t]);

  const removeRow = useCallback(
    (index: number): void => {
      if (onChange == null) return;

      // avoid mutation of existing data from our parent
      const updatedEntries = [...entries];
      updatedEntries.splice(index, 1);
      onChange(updatedEntries);
    },
    [entries, onChange]
  );

  return (
    <>
      <>
        <div className="col-span-2 border-b border-theme-primary-200 bg-theme-primary-900 px-3 py-2.5">
          <Text textStyle="400-bold" color="neutral.100">
            {t(`By: ${title}`)}
          </Text>
        </div>
        {/* Column headers */}
        <div className="col-span-1 flex items-center bg-theme-neutral-200 px-3 py-2">
          <Text textStyle="300-bold" color="neutral.800">
            {t(`${title} Definition`)}
          </Text>
        </div>
        <div className="col-span-1 flex items-center justify-center bg-theme-neutral-200 px-3 py-2 text-center">
          <Text color="neutral.800" textStyle="300-bold">
            {t(`Number of ${displayTrackingType}`)}
          </Text>
        </div>
      </>
      {rows.map(({ entryIndex, typeName, label, userLabel, amount }, index) => (
        <TrackingRow
          key={index}
          onChange={
            onChange == null ? undefined : (amount, userLabel) => onRowChange(entryIndex, typeName, amount, userLabel)
          }
          onBlur={onBlur}
          onDelete={onChange == null ? undefined : () => removeRow(entryIndex)}
          usesName={addNameLabel != null}
          {...{ entryType, label, userLabel, amount }}
        />
      ))}
      {addNameButton}
      <>
        <div className={classNames("col-span-1 flex items-center justify-between bg-theme-neutral-100 px-3 py-2.5")}>
          <Text color="primary.900" textStyle="300-bold">
            {domain === "demographics" ? t("Total Created:") : t("Total:")}
          </Text>
        </div>
        <div
          className={classNames("flex items-center justify-center px-3 py-2.5", "col-span-1", {
            "bg-theme-error-100": status === "in-progress",
            "bg-theme-primary-100": status != "in-progress"
          })}
        >
          <Text color={status === "in-progress" ? "theme.error.900" : "theme.primary.800"} textStyle="300-bold">
            {total}
          </Text>
        </div>
      </>
    </>
  );
};

export default TrackingSection;
