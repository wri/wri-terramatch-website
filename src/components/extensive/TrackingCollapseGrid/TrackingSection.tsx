import { useT } from "@transifex/react";
import classNames from "classnames";
import { sortBy } from "lodash";
import { FC, useCallback, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import TrackingRow from "@/components/extensive/TrackingCollapseGrid/TrackingRow";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Icon, { IconNames } from "../Icon/Icon";
import { useSectionData } from "./hooks";
import { Status, TrackingGridVariantProps, TrackingType, useEntryTypeDefinition, useTrackingLabels } from "./types";

export interface TrackingSectionProps {
  trackingType: TrackingType;
  entryType: string;
  entries: TrackingEntryDto[];
  variant: TrackingGridVariantProps;
  onChange?: (entries: TrackingEntryDto[]) => void;
  status?: Status;
}

const TrackingSection: FC<TrackingSectionProps> = ({ trackingType, entryType, entries, variant, onChange, status }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const t = useT();
  const { title, rows, total, position } = useSectionData(trackingType, entryType, entries);
  const { addNameLabel, typeMap } = useEntryTypeDefinition(trackingType, entryType);

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
      setOpenMenu(false);
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

  // Tailwind doesn't supply classes for high row counts, so we apply this prop ourselves.
  const rowSpanCount = addNameLabel == null || onChange == null ? rows.length + 1 : rows.length + 2;
  const firstColGridRow = `span ${rowSpanCount} / span ${rowSpanCount}`;
  const { sectionLabel, rowLabelSingular, rowLabelPlural } = useTrackingLabels(trackingType);

  return (
    <>
      <div
        className={classNames("flex items-center justify-center bg-white", variant.firstCol, {
          [variant.roundedTl]: position === "first",
          [variant.roundedBl]: position === "last",
          [`!row-span-${rows.length > 6 ? "full" : rows.length + 2}`]: addNameLabel != null
        })}
        style={{ gridRow: firstColGridRow }}
      >
        <Text variant="text-14-light">{t(title)}</Text>
      </div>

      <div className={classNames("bg-white", variant.secondCol)}>
        <Text variant="text-14-semibold" className={classNames("text-customBlue-50 px-4 py-2", variant.columTitle)}>
          {t(`${sectionLabel} ${rowLabelPlural}`)}
        </Text>
      </div>
      <div
        className={classNames("bg-white", variant.tertiaryCol, {
          [`${variant.roundedTr}`]: position === "first",
          "rounded-none": position !== "first"
        })}
      >
        <Text
          as="span"
          variant="text-14-semibold"
          className={classNames(
            "text-customBlue-50 flex items-start justify-center gap-2 px-4 py-2 leading-normal",
            variant.columTitle,
            { [`${variant.roundedTr}`]: position === "first" }
          )}
        >
          {t(`{total} ${total === 1 ? rowLabelSingular : rowLabelPlural}`, { total })}
        </Text>
      </div>
      {rows.map(({ entryIndex, typeName, label, userLabel, amount }, index) => (
        <TrackingRow
          key={index}
          trackingType={trackingType}
          onChange={
            onChange == null ? undefined : (amount, userLabel) => onRowChange(entryIndex, typeName, amount, userLabel)
          }
          onDelete={onChange == null ? undefined : () => removeRow(entryIndex)}
          usesName={addNameLabel != null}
          {...{ entryType, label, userLabel, amount, variant }}
        />
      ))}

      <When condition={addNameLabel != null && onChange != null}>
        <div className={classNames("flex items-center bg-white", variant.secondCol)}>
          <div className="relative">
            <button
              className={"text-14-semibold text-customBlue-100 flex items-baseline gap-1 px-4 py-2 hover:text-primary"}
              onClick={() => setOpenMenu(!openMenu)}
            >
              {addNameLabel && t(addNameLabel)}
              <Icon
                name={IconNames.IC_ARROW_COLLAPSE}
                width={9}
                height={9}
                className={classNames("duration-150", { "rotate-180 transform": openMenu })}
              />
            </button>
            <When condition={openMenu}>
              <div className="absolute z-10 -my-1 rounded-lg border border-neutral-200 bg-white p-2">
                {addNameLabel == null
                  ? null
                  : sortBy(Object.keys(typeMap), subtype => t(typeMap[subtype])).map(subtype => (
                      <button
                        key={subtype}
                        className="hover:bg-customBlue-75 w-full rounded-lg p-2 text-left hover:text-primary"
                        onClick={() => addRow(subtype)}
                      >
                        {t(typeMap[subtype])}
                      </button>
                    ))}
              </div>
            </When>
          </div>
        </div>
        <div className={classNames("bg-white", variant.roundedBr, variant.tertiaryCol)} />
      </When>
    </>
  );
};

export default TrackingSection;
