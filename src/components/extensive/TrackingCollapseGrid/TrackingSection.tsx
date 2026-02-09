import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { sortBy, startCase } from "lodash";
import { FC, useCallback } from "react";

import TrackingRow from "@/components/extensive/TrackingCollapseGrid/TrackingRow";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";

import { useSectionData } from "./hooks";
import { Status, TrackingGridVariantProps, TrackingType, useEntryTypeDefinition } from "./types";

export interface TrackingSectionProps {
  trackingType: TrackingType;
  entryType: string;
  entries: TrackingEntryDto[];
  variant: TrackingGridVariantProps;
  onChange?: (entries: TrackingEntryDto[]) => void;
  status?: Status;
}

const TrackingSection: FC<TrackingSectionProps> = ({ trackingType, entryType, entries, variant, onChange, status }) => {
  const t = useT();
  const { title, rows, total } = useSectionData(trackingType, entryType, entries);
  const { addNameLabel, typeMap } = useEntryTypeDefinition(trackingType, entryType);
  const displayTrackingType = trackingType.includes("Beneficiaries") ? "Beneficiaries" : startCase(trackingType);

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
        <div className="border-theme-primary-200 bg-theme-primary-900 col-span-2 border-b px-3 py-2.5">
          <Text color="neutral.100" fontSize="16px" lineHeight="24px" fontWeight="bold">
            {t("By: " + title)}
          </Text>
        </div>
        {/* Column headers */}
        <div className="bg-theme-neutral-200 col-span-1 flex items-center px-3 py-2">
          <Text color="neutral.800" fontSize="14px" lineHeight="20px" fontWeight="bold">
            {t(`${title} Definition`)}
          </Text>
        </div>
        <div className="bg-theme-neutral-200 col-span-1 flex items-center px-3 py-2 text-center">
          <Text color="neutral.800" fontSize="14px" lineHeight="20px" fontWeight="bold">
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
          onDelete={onChange == null ? undefined : () => removeRow(entryIndex)}
          usesName={addNameLabel != null}
          {...{ entryType, label, userLabel, amount }}
        />
      ))}
      {addNameLabel != null && onChange != null && (
        <div className={classNames("flex items-center py-3", "col-span-2 border-b border-neutral-200 bg-white")}>
          <MultiActionButton
            mainActionLabel="Add Ethnic Group"
            mainActionOnClick={() => {}}
            otherActions={[
              ...sortBy(Object.keys(typeMap), subtype => t(typeMap[subtype])).map(subtype => ({
                label: t(typeMap[subtype]),
                onClick: () => addRow(subtype),
                value: subtype
              }))
            ]}
            size="small"
            variant="secondary"
          />
        </div>
      )}
      <>
        <div className={classNames("bg-theme-neutral-100 col-span-1 flex items-center justify-between px-3 py-2.5")}>
          <Text color="primary.900" fontSize="14px" lineHeight="20px" fontWeight="bold">
            {t(`Total Created:`)}
          </Text>
        </div>
        <div
          className={classNames("flex items-center justify-center px-3 py-2.5", "bg-theme-primary-100 col-span-1", {
            "bg-theme-error-100": status === "in-progress",
            "bg-theme-primary-100": status != "in-progress"
          })}
        >
          <Text
            color={status === "in-progress" ? "theme.error.900" : "theme.primary.800"}
            fontSize="14px"
            lineHeight="20px"
            fontWeight="bold"
          >
            {t(`{total}`, { total })}
          </Text>
        </div>
      </>
    </>
  );
};

export default TrackingSection;
