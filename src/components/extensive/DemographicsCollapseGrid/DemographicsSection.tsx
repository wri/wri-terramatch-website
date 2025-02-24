import { useT } from "@transifex/react";
import classNames from "classnames";
import { Fragment, useCallback, useMemo, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import DemographicsRow from "@/components/extensive/DemographicsCollapseGrid/DemographicsRow";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Icon, { IconNames } from "../Icon/Icon";
import { useSectionData } from "./hooks";
import {
  DEMOGRAPHIC_TYPE_MAP,
  DEMOGRAPHIC_TYPES,
  DemographicGridVariantProps,
  DemographicType,
  HBF_DEMOGRAPHIC_TYPE_MAP
} from "./types";

export interface DemographicsSectionProps {
  demographicType: DemographicType;
  entryType: string;
  entries: DemographicEntryDto[];
  variant: DemographicGridVariantProps;
  onChange?: (demographics: DemographicEntryDto[]) => void;
}

const useDemographicType = (entryType: string) => {
  const { framework } = useFrameworkContext();
  return useMemo(
    () => (framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP)[entryType],
    [entryType, framework]
  );
};

const DemographicsSection = ({ demographicType, entryType, entries, variant, onChange }: DemographicsSectionProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const t = useT();
  const { title, rows, total, position } = useSectionData(entryType, entries);
  const { addNameLabel, typeMap } = useDemographicType(entryType);

  const onRowChange = useCallback(
    (index: number, subtype: string, amount: number, userLabel?: string) => {
      if (onChange == null) return;

      // avoid mutation of existing data from our parent
      const updatedEntries = [...entries];
      const demographic: DemographicEntryDto =
        index >= 0
          ? { ...updatedEntries[index] }
          : // We can ignore name here because when a type uses names, we never have a row
            // that doesn't exist in the demographics array, so the index can never be < 0
            { type: entryType, subtype, amount };

      if (userLabel != null) {
        demographic.name = userLabel;
      }
      demographic.amount = amount;
      if (index < 0) {
        updatedEntries.push(demographic);
      } else {
        updatedEntries[index] = demographic;
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
      const updatedDemographics = [...entries];
      updatedDemographics.splice(index, 1);
      onChange(updatedDemographics);
    },
    [entries, onChange]
  );

  // Tailwind doesn't supply classes for high row counts, so we apply this prop ourselves.
  const rowSpanCount = addNameLabel == null || onChange == null ? rows.length + 1 : rows.length + 2;
  const firstColGridRow = `span ${rowSpanCount} / span ${rowSpanCount}`;
  const { sectionLabel, rowLabelSingular, rowLabelPlural } = DEMOGRAPHIC_TYPES[demographicType];

  return (
    <Fragment>
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
          {t(sectionLabel)}
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
      {rows.map(({ demographicIndex, typeName, label, userLabel, amount }, index) => (
        <DemographicsRow
          key={index}
          onChange={
            onChange == null
              ? undefined
              : (amount, userLabel) => onRowChange(demographicIndex, typeName, amount, userLabel)
          }
          onDelete={onChange == null ? undefined : () => removeRow(demographicIndex)}
          usesName={addNameLabel != null}
          {...{ demographicType, entryType, label, userLabel, amount, variant }}
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
        <div className={classNames("bg-white", variant.roundedBr, variant.tertiaryCol)} />
      </When>
    </Fragment>
  );
};

export default DemographicsSection;
