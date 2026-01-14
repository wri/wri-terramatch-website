import { useT } from "@transifex/react";
import classNames from "classnames";
import { useCallback, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import DemographicsRow from "@/components/extensive/DemographicsCollapseGrid/DemographicsRow";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Icon, { IconNames } from "../Icon/Icon";
import { useSectionData } from "./hooks";
import {
  DemographicGridVariantProps,
  DemographicType,
  Status,
  useDemographicLabels,
  useEntryTypeDefinition
} from "./types";

export interface DemographicsSectionProps {
  demographicType: DemographicType;
  entryType: string;
  entries: DemographicEntryDto[];
  variant: DemographicGridVariantProps;
  onChange?: (demographics: DemographicEntryDto[]) => void;
  status?: Status;
}

const DemographicsSection = ({
  demographicType,
  entryType,
  entries,
  variant,
  onChange,
  status
}: DemographicsSectionProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const t = useT();
  const { title, rows, total, position } = useSectionData(demographicType, entryType, entries);
  const { addNameLabel, typeMap } = useEntryTypeDefinition(demographicType, entryType);

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
  const { sectionLabel, rowLabelSingular, rowLabelPlural } = useDemographicLabels(demographicType);

  const isNewJobs = demographicType === "newJobs";

  return (
    <>
      {!isNewJobs && (
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
      )}
      {isNewJobs ? (
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
              {t(`Number of Jobs`)}
            </Text>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
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
      {isNewJobs && (
        <>
          <div
            className={classNames(
              "flex items-center justify-between px-4 py-3",
              isNewJobs ? "col-span-1 border-b border-neutral-200 bg-white" : `${variant.secondCol} bg-white`
            )}
          >
            <Text variant="text-14-semibold" className="text-darkCustom">
              {t(`Total Created:`)}
            </Text>
          </div>
          <div
            className={classNames(
              "flex items-center justify-center px-4 py-3",
              isNewJobs ? "col-span-1 border-b border-neutral-200 bg-white" : `${variant.secondCol} bg-white`,
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
      )}
      <When condition={addNameLabel != null && onChange != null}>
        <div
          className={classNames(
            "flex items-center py-3",
            isNewJobs ? "col-span-2 border-b border-neutral-200 bg-white" : `${variant.secondCol} bg-white`
          )}
        >
          <div className="relative">
            <button
              className={classNames(
                "text-14-semibold flex items-baseline gap-1 px-4 py-1 hover:text-primary",
                isNewJobs ? "text-primary" : "text-customBlue-100"
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
            isNewJobs
              ? "col-span-2 border-b border-l border-b-neutral-200 border-l-white bg-white"
              : `${variant.tertiaryCol} bg-white`
          )}
        />
      </When>
    </>
  );
};

export default DemographicsSection;
