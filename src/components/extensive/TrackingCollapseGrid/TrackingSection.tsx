import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import TrackingRow from "@/components/extensive/TrackingCollapseGrid/TrackingRow";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Icon, { IconNames } from "../Icon/Icon";
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

export function camelCaseToTitleCase(str: string): string {
  if (str == null) return str;
  if (str.includes("Beneficiaries")) {
    return "Beneficiaries";
  }
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

const TrackingSection: FC<TrackingSectionProps> = ({ trackingType, entryType, entries, variant, onChange, status }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const t = useT();
  const { title, rows, total } = useSectionData(trackingType, entryType, entries);
  const { addNameLabel, typeMap } = useEntryTypeDefinition(trackingType, entryType);
  const displayTrackingType = /[a-z][A-Z]/.test(trackingType)
    ? camelCaseToTitleCase(trackingType)
    : trackingType?.replace(/^\w/, c => c.toUpperCase());

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

  return (
    <>
      <>
        <div className="col-span-2 border-b border-neutral-300 bg-neutral-700 px-4 py-3">
          <Text variant="text-14-semibold" className="mb-1 text-white">
            {t("By: " + title)}
          </Text>
        </div>
        {/* Column headers */}
        <div className="col-span-1 border-b border-neutral-300 bg-neutral-200 px-4 py-2">
          <Text variant="text-12-semibold" className="text-darkCustom">
            {t(`${title} Definition`)}
          </Text>
        </div>
        <div className="col-span-1 border-b border-l border-b-neutral-300 border-l-white bg-neutral-200 px-4 py-2 text-center">
          <Text variant="text-12-semibold" className="text-darkCustom">
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

      <>
        <div
          className={classNames(
            "flex items-center justify-between px-4 py-3",
            "col-span-1 border-b border-neutral-200 bg-white"
          )}
        >
          <Text variant="text-14-semibold" className="text-darkCustom">
            {t(`Total Created:`)}
          </Text>
        </div>
        <div
          className={classNames(
            "flex items-center justify-center px-4 py-3",
            "col-span-1 border-b border-neutral-200 bg-white",
            { "!bg-theme-error-100": status === "in-progress" }
          )}
        >
          <Text
            variant="text-14-semibold"
            className={classNames("text-center text-darkCustom", {
              "text-theme-error-900": status === "in-progress"
            })}
          >
            {t(`{total}`, { total })}
          </Text>
        </div>
      </>

      <When condition={addNameLabel != null && onChange != null}>
        <div className={classNames("flex items-center py-3", "col-span-2 border-b border-neutral-200 bg-white")}>
          <div className="relative">
            <button
              className={classNames(
                "text-14-semibold flex items-baseline gap-1 px-4 py-1 hover:text-primary",
                "text-primary"
              )}
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
              <div className="shadow-lg absolute z-10 -my-1 rounded-lg border border-b-neutral-200  bg-white p-2">
                {addNameLabel == null
                  ? null
                  : Object.keys(typeMap).map(subtype => (
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
        <div
          className={classNames(
            "py-3",
            variant.roundedBr,
            "col-span-2 border-b border-l border-b-neutral-200 border-l-white bg-white"
          )}
        />
      </When>
    </>
  );
};

export default TrackingSection;
