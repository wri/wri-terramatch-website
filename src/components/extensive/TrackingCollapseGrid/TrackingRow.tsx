import { Button, Text } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, FormEvent, useCallback } from "react";

import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { Delete } from "@/redesignComponents/foundations/Icons";

import { TrackingGridVariantProps, TrackingType, useTrackingLabels } from "./types";

export interface TrackingRowProps {
  entryType: string;
  usesName: boolean;
  label: string;
  userLabel?: string;
  amount: number;
  onChange?: (amount: number, userLabel?: string) => void;
  onBlur?: () => void;
  onDelete?: () => void;
  trackingType: TrackingType;
  variant: TrackingGridVariantProps;
}

const TrackingRow: FC<TrackingRowProps> = ({ usesName, label, userLabel, amount, onChange, onBlur, onDelete }) => {
  const t = useT();

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

  const { rowLabelSingular, rowLabelPlural } = useTrackingLabels(trackingType);

  return (
    <>
      <div
        className={classNames(
          "flex items-center justify-between px-4 py-3",
          "col-span-1 border-b border-neutral-200 bg-white"
        )}
      >
        <Text fontSize="16px" lineHeight="24px" color="neutral.800">
          {t(label)}
        </Text>
        {usesName && (
          <>
            {onChange == null ? (
              <Text fontSize="14px" lineHeight="20px" color="neutral.800" className="items-left flex w-3/5 px-2 py-1">
                {userLabel}
              </Text>
            ) : (
              <TextInput
                size="small"
                placeholder={t("Add details")}
                value={userLabel ?? ""}
                onChange={onUserLabelChange}
                onBlur={onBlur}
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
            )}
            {onChange != null && (
              <Button onClick={onDelete} className="flex items-center gap-1.5">
                <Delete color="error.500" boxSize={3} className="leading-4" />
                <Text fontSize="12px" lineHeight="16px" color="error.900" fontWeight="bold">
                  {t("Remove")}
                </Text>
              </Button>
            )}
          </>
        )}
      </div>
      <div
        className={classNames(
          "relative flex items-center justify-center py-3",
          "col-span-1 border-b border-l border-b-neutral-200 border-l-white bg-white"
        )}
      >
        {onChange == null ? (
          <Text fontSize="14px" lineHeight="20px" color="neutral.800" className="w-full px-4 text-center">
            {amount}
          </Text>
        ) : (
          <div className="flex w-[5.625rem] items-center justify-center">
            <TextInput
              size="small"
              value={amount}
              onChange={onAmountChange}
              onBlur={onBlur}
              css={css`
                width: 100%;
                & > div {
                  margin-bottom: 0;
                }
                & input {
                  margin-top: 0;
                }
              `}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TrackingRow;
