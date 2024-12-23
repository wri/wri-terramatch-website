import { useT } from "@transifex/react";
import classNames from "classnames";
import { Fragment, useCallback, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import DemographicsRow from "@/components/extensive/DemographicsCollapseGrid/DemographicsRow";
import { Framework, useFrameworkContext } from "@/context/framework.provider";

import Icon, { IconNames } from "../Icon/Icon";
import { useSectionData } from "./hooks";
import {
  Demographic,
  DEMOGRAPHIC_TYPE_MAP,
  DEMOGRAPHICAL_TYPES,
  DemographicalType,
  DemographicGridVariantProps,
  DemographicType,
  HBF_DEMOGRAPHIC_TYPE_MAP,
  HBFDemographicType
} from "./types";

export interface DemographicsSectionProps {
  demographicalType: DemographicalType;
  demographics: Demographic[];
  type: DemographicType | HBFDemographicType;
  variant: DemographicGridVariantProps;
  onChange?: (demographics: Demographic[]) => void;
}

const DemographicsSection = ({
  demographicalType,
  demographics,
  type,
  variant,
  onChange
}: DemographicsSectionProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { framework } = useFrameworkContext();
  const t = useT();
  const { title, rows, total, position, subtypes } = useSectionData(type, demographics);
  const demographicTypes = framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP;
  const { addSubtypeLabel } = demographicTypes[type];

  const onRowChange = useCallback(
    (index: number, name: string, amount: number, userLabel?: string) => {
      if (onChange == null) return;

      // avoid mutation of existing data from our parent
      const updatedDemographics = [...demographics];
      const demographic: Demographic =
        index >= 0
          ? { ...updatedDemographics[index] }
          : // We can ignore subtype here because when a type uses subtypes, we never have a row
            // that doesn't exist in the demographics array, so the index can never be < 0
            { type, name, amount };

      if (subtypes != null) {
        demographic.name = userLabel;
      }
      demographic.amount = amount;
      if (index < 0) {
        updatedDemographics.push(demographic);
      } else {
        updatedDemographics[index] = demographic;
      }

      onChange(updatedDemographics);
    },
    [demographics, onChange, type, subtypes]
  );

  const addRow = useCallback(
    (subtype: string) => {
      setOpenMenu(false);
      onChange?.([...demographics, { type, subtype, amount: 0 }]);
    },
    [demographics, onChange, type]
  );

  const removeRow = useCallback(
    (index: number): void => {
      if (onChange == null) return;

      // avoid mutation of existing data from our parent
      const updatedDemographics = [...demographics];
      updatedDemographics.splice(index, 1);
      onChange(updatedDemographics);
    },
    [demographics, onChange]
  );

  // Tailwind doesn't supply classes for high row counts, so we apply this prop ourselves.
  const rowSpanCount = subtypes == null || onChange == null ? rows.length + 1 : rows.length + 2;
  const firstColGridRow = `span ${rowSpanCount} / span ${rowSpanCount}`;
  const { sectionLabel, rowLabelSingular, rowLabelPlural } = DEMOGRAPHICAL_TYPES[demographicalType];

  return (
    <Fragment>
      <div
        className={classNames("flex items-center justify-center bg-white", variant.firstCol, {
          [variant.roundedTl]: position === "first",
          [variant.roundedBl]: position === "last",
          [`!row-span-${rows.length > 6 ? "full" : rows.length + 2}`]: subtypes != null
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
          demographicalType={demographicalType}
          onChange={
            onChange == null
              ? undefined
              : (amount, userLabel) => onRowChange(demographicIndex, typeName, amount, userLabel)
          }
          onDelete={onChange == null ? undefined : () => removeRow(demographicIndex)}
          {...{ type, subtypes, label, userLabel, amount, variant }}
        />
      ))}
      <When condition={subtypes != null && onChange != null}>
        <div className={classNames("flex items-center bg-white", variant.secondCol)}>
          <div className="relative">
            <button
              className={"text-14-semibold text-customBlue-100 flex items-baseline gap-1 px-4 py-2 hover:text-primary"}
              onClick={() => setOpenMenu(!openMenu)}
            >
              {addSubtypeLabel && t(addSubtypeLabel)}
              <Icon
                name={IconNames.IC_ARROW_COLLAPSE}
                width={9}
                height={9}
                className={classNames("duration-150", { "rotate-180 transform": openMenu })}
              />
            </button>
            <When condition={openMenu}>
              <div className="absolute z-10 -my-1 rounded-lg border border-neutral-200 bg-white p-2">
                {subtypes &&
                  Object.keys(subtypes).map(subtype => (
                    <button
                      key={subtype}
                      className="hover:bg-customBlue-75 w-full rounded-lg p-2 text-left hover:text-primary"
                      onClick={() => addRow(subtype)}
                    >
                      {t(subtypes[subtype])}
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
