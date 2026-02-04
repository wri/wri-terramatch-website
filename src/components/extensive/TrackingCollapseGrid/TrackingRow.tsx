import { Button, Text } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, FormEvent, useCallback, useRef, useState } from "react";
import { When } from "react-if";

import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { Delete } from "@/redesignComponents/foundations/Icons";

export interface TrackingRowProps {
  entryType: string;
  usesName: boolean;
  label: string;
  userLabel?: string;
  amount: number;
  onChange?: (amount: number, userLabel?: string) => void;
  onDelete?: () => void;
}

const TrackingRow: FC<TrackingRowProps> = ({ entryType, usesName, label, userLabel, amount, onChange, onDelete }) => {
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

  return (
    <>
      <div
        className={classNames(
          "flex items-center justify-between px-4 py-3",
          "col-span-1 border-b border-neutral-200 bg-white"
        )}
      >
        <When condition={label != null}>
          <Text fontSize="16px" lineHeight="24px" color="neutral.800">
            {t(label)}
          </Text>
        </When>
        <When condition={usesName}>
          <When condition={onChange == null}>
            <Text fontSize="14px" lineHeight="20px" color="neutral.800" className="items-left flex w-3/5 px-2 py-1">
              {userLabel}
            </Text>
          </When>
          <When condition={onChange != null}>
            <TextInput
              size="small"
              placeholder={t("Add details")}
              value={userLabel ?? ""}
              onChange={onUserLabelChange}
              css={css`
                width: 100%;
                padding: 0 24px 0 16px;
                & > div {
                  margin-bottom: 0;
                }
                & input {
                  margin-top: 0;
                }
              `}
            />
          </When>
          <When condition={usesName}>
            <Button onClick={onDelete} className="flex items-center gap-1.5">
              <Delete color="error.500" boxSize={3} className="leading-4" />
              <Text fontSize="12px" lineHeight="16px" color="error.900">
                Remove
              </Text>
            </Button>
          </When>
        </When>
      </div>
      <div
        className={classNames(
          "relative flex items-center justify-center py-3",
          "col-span-1 border-b border-l border-b-neutral-200 border-l-white bg-white"
        )}
      >
        <When condition={onChange == null}>
          <Text fontSize="14px" lineHeight="20px" color="neutral.800" className="w-full px-4 text-center">
            {amount}
          </Text>
        </When>
        <When condition={onChange != null}>
          <div className="flex w-16 items-center justify-center">
            <TextInput
              ref={inputRef}
              size="small"
              value={focused ? amount : t(`{amount}`, { amount })}
              type={focused ? "text" : undefined}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onClick={handleClick}
              onChange={onAmountChange}
              css={css`
                width: 100%;
                padding: 0 24px 0 16px;
                & > div {
                  margin-bottom: 0;
                }
                & input {
                  margin-top: 0;
                }
              `}
            />
          </div>
        </When>
      </div>
    </>
  );
};

export default TrackingRow;
