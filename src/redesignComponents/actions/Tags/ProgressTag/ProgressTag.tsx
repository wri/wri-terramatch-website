import { Tag, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { STATE_PROGRESS_TAG } from "./constants/stateProgressTag";

export type ProgressState = "not-started" | "in-progress" | "completed" | "not-available";

export interface ProgressTagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  state?: ProgressState | null;
  className?: string;
}

export const ProgressTag: FC<ProgressTagProps> = ({ state = null, className }) => {
  const t = useT();

  if (state == null) {
    return null;
  }

  const { label, icon } = STATE_PROGRESS_TAG[state];

  return (
    <Tag.Root
      className={classNames(
        "flex w-fit min-w-fit items-center gap-1 rounded-full border-0 px-2 py-1 shadow-none",
        state === "not-available" ? "bg-theme-neutral-300" : "bg-theme-neutral-100",
        className
      )}
    >
      <Tag.Label className="flex items-center gap-1">
        {icon}
        <Text as="span" color="neutral.900" textStyle="200" whiteSpace="nowrap">
          {t("Planting:")}{" "}
          <Text as="span" textStyle="200-bold">
            {t(label)}
          </Text>
        </Text>
      </Tag.Label>
    </Tag.Root>
  );
};

export default ProgressTag;
