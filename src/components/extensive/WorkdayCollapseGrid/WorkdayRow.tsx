import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary, startCase } from "lodash";
import { FormEvent, Fragment, useCallback, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { DemographicType, WorkdayGridVariantProps } from "./types";

export interface WorkdayRowProps {
  type: DemographicType;
  subtypes?: Dictionary<string>;
  label: string;
  userLabel?: string;
  amount: number;
  onChange?: (amount: number, userLabel?: string) => void;
  onDelete?: () => void;
  variant: WorkdayGridVariantProps;
}

const WorkdayRow = ({ type, subtypes, label, userLabel, amount, onChange, onDelete, variant }: WorkdayRowProps) => {
  const [focused, setFocused] = useState(false);
  const t = useT();

  const onAmountChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const {
        currentTarget: { value }
      } = event;
      const newAmount = Number(value);
      if (!isNaN(newAmount)) {
        onChange?.(newAmount, userLabel);
      }
    },
    [onChange, userLabel]
  );

  const onUserLabelChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      onChange?.(amount, event.currentTarget.value);
    },
    [onChange, amount]
  );

  return (
    <Fragment>
      <div className={classNames("flex items-center justify-between bg-white px-4", variant.secondCol)}>
        <Text variant="text-14-light" className="flex items-center">
          {t(label)}
        </Text>
        <When condition={subtypes != null}>
          <When condition={onChange == null}>
            <Text variant="text-14-light" className="items-left flex w-3/5 px-2 py-1">
              {userLabel}
            </Text>
          </When>
          <When condition={onChange != null}>
            <input
              placeholder={t(`Enter ${startCase(type)}`)}
              className="text-14-light h-min w-3/5 rounded border border-transparent px-2 py-1 outline-0 hover:border hover:border-primary hover:shadow-blue-border-input"
              value={userLabel ?? ""}
              onChange={onUserLabelChange}
            />
          </When>
        </When>
      </div>
      <div className={classNames("flex items-center justify-center bg-white", variant.tertiaryCol)}>
        <When condition={onChange == null}>
          <Text variant="text-14-light" className="w-full px-4 py-[9.5px] text-center">
            {t("{amount} Days", { amount })}
          </Text>
        </When>
        <When condition={onChange != null}>
          <input
            value={focused ? amount : t("{amount} Days", { amount })}
            type={focused ? "number" : undefined}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={onAmountChange}
            className="text-14-light w-16 border border-transparent px-0 py-[9.5px] text-center outline-0 hover:border hover:border-primary hover:shadow-blue-border-input"
          />
          <When condition={subtypes != null}>
            <div className="absolute ml-20 cursor-pointer opacity-30 hover:opacity-60" onClick={onDelete}>
              <Icon name={IconNames.CROSS} viewBox="0 0 24 24" />
            </div>
          </When>
        </When>
      </div>
    </Fragment>
  );
};

export default WorkdayRow;
