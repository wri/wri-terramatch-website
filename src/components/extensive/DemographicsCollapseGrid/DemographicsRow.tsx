import { useT } from "@transifex/react";
import classNames from "classnames";
import { startCase } from "lodash";
import { FormEvent, useCallback, useRef, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { DemographicGridVariantProps, DemographicType, useDemographicLabels } from "./types";

export interface DemographicsRowProps {
  demographicType: DemographicType;
  entryType: string;
  usesName: boolean;
  label: string;
  userLabel?: string;
  amount: number;
  onChange?: (amount: number, userLabel?: string) => void;
  onDelete?: () => void;
  variant: DemographicGridVariantProps;
}

const DemographicsRow = ({
  demographicType,
  entryType,
  usesName,
  label,
  userLabel,
  amount,
  onChange,
  onDelete,
  variant
}: DemographicsRowProps) => {
  const [focused, setFocused] = useState(false);
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (inputRef.current != null) {
      requestAnimationFrame(() => {
        const input = inputRef.current!;
        const length = input.value.length;
        input.setSelectionRange(length, length);
      });
    }
  }, []);

  const onAmountChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const {
        currentTarget: { value }
      } = event;
      const newAmount = Number(value);
      if (!isNaN(newAmount) && newAmount >= 0) {
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

  const { rowLabelSingular, rowLabelPlural } = useDemographicLabels(demographicType);

  return (
    <>
      <div className={classNames("flex items-center justify-between bg-white px-4", variant.secondCol)}>
        <Text variant="text-14-light" className="flex items-center">
          {t(label)}
        </Text>
        <When condition={usesName}>
          <When condition={onChange == null}>
            <Text variant="text-14-light" className="items-left flex w-3/5 px-2 py-1">
              {userLabel}
            </Text>
          </When>
          <When condition={onChange != null}>
            <input
              placeholder={t(`Enter ${startCase(entryType)}`)}
              className="text-14-light hover:shadow-blue-border-input h-min w-3/5 rounded border border-transparent px-2 py-1 outline-0 hover:border hover:border-primary"
              value={userLabel ?? ""}
              onChange={onUserLabelChange}
            />
          </When>
        </When>
      </div>
      <div className={classNames("relative flex items-center justify-center bg-white", variant.tertiaryCol)}>
        <When condition={onChange == null}>
          <Text variant="text-14-light" className="w-full px-4 py-[9.5px] text-center">
            {t(`{amount} ${amount === 1 ? rowLabelSingular : rowLabelPlural}`, { amount })}
          </Text>
        </When>
        <When condition={onChange != null}>
          <input
            ref={inputRef}
            value={focused ? amount : t(`{amount} ${amount === 1 ? rowLabelSingular : rowLabelPlural}`, { amount })}
            type={focused ? "text" : undefined}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onClick={handleClick}
            onChange={onAmountChange}
            className="text-14-light hover:shadow-blue-border-input border border-transparent px-0 py-[9.5px] text-center outline-0 hover:border hover:border-primary"
          />
          <When condition={usesName}>
            <div className="absolute ml-20 cursor-pointer opacity-30 hover:opacity-60" onClick={onDelete}>
              <Icon name={IconNames.CROSS} viewBox="0 0 24 24" />
            </div>
          </When>
        </When>
      </div>
    </>
  );
};

export default DemographicsRow;
