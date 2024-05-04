import { useT } from "@transifex/react";
import classNames from "classnames";
import { startCase } from "lodash";
import { Fragment, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { useSectionData } from "./hooks";
import { Demographic, DemographicType, WorkdayGridVariantProps } from "./types";

export interface WorkdaySectionProps {
  demographics: Demographic[];
  type: DemographicType;
  variant: WorkdayGridVariantProps;
  // TODO real signature
  onChange?: () => void;
}

const WorkdaySection = ({ demographics, type, variant, onChange }: WorkdaySectionProps) => {
  const [editUserLabel, setEditUserLabel] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const t = useT();
  const { title, rows, total, position, subtypes } = useSectionData(type, demographics);

  return (
    <Fragment>
      <div
        className={classNames(
          "flex items-center justify-center bg-white",
          variant.firstCol,
          `row-span-${rows.length > 7 ? "full" : rows.length + 1}`,
          {
            [variant.roundedTl]: position === "first",
            [variant.roundedBl]: position === "last",
            [`!row-span-${rows.length > 6 ? "full" : rows.length + 2}`]: subtypes != null
          }
        )}
      >
        <Text variant="text-14-light">{t(title)}</Text>
      </div>

      <div className={classNames("bg-white", variant.secondCol)}>
        <Text variant="text-14-semibold" className={classNames("px-4 py-2 text-customBlue-50", variant.columTitle)}>
          Total Workdays
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
            "flex items-start justify-center gap-2 px-4 py-2 leading-normal text-customBlue-50",
            variant.columTitle,
            { [`${variant.roundedTr}`]: position === "first" }
          )}
        >
          {t("{total} Days", { total })}
          <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className={variant.totalIcon} />
        </Text>
      </div>
      {rows.map(({ label, userLabel, amount }) => (
        <Fragment key={`${label}|${userLabel}`}>
          <div className={classNames("flex items-center justify-between bg-white px-4", variant.secondCol)}>
            <Text variant="text-14-light" className="flex items-center">
              {t(label)}
            </Text>
            <When condition={editUserLabel && subtypes != null}>
              <input
                placeholder={t(`Enter ${startCase(type)}`)}
                className="text-14-light h-min w-3/5 rounded px-2 py-1 outline-0 hover:border hover:border-primary hover:shadow-blue-border-input"
              />
            </When>
          </div>
          <div className={classNames("bg-white", variant.tertiaryCol)}>
            <input
              placeholder={t("{amount} Days", { amount })}
              defaultValue={amount}
              className="text-14-light w-full border border-transparent px-4 py-[9.5px] text-center outline-0 hover:border-primary hover:shadow-blue-border-input"
            />
          </div>
        </Fragment>
      ))}
      <When condition={subtypes != null && onChange != null}>
        <div className={classNames("flex items-center bg-white", variant.secondCol)}>
          <div className="relative">
            <button
              className={"text-14-semibold flex items-baseline gap-1 px-4 py-2 text-customBlue-100 hover:text-primary"}
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
            >
              {t(`Add ${t(startCase(type))} Group`)}
              <Icon
                name={IconNames.IC_ARROW_COLLAPSE}
                width={9}
                height={9}
                className={classNames("duration-150", { "rotate-180 transform": openMenu })}
              />
            </button>
            <When condition={openMenu}>
              <div className="absolute rounded-lg border border-neutral-200 bg-white p-2">
                {subtypes &&
                  Object.keys(subtypes).map(subtype => (
                    <button
                      key={subtype}
                      className="w-full rounded-lg p-2 text-left hover:bg-customBlue-75 hover:text-primary"
                      onClick={() => setEditUserLabel(!editUserLabel)}
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

export default WorkdaySection;
