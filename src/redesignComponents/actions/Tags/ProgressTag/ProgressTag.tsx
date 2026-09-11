import { Tag, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { STATE_PROGRESS_TAG } from "./constants/stateProgressTag";

export type ProgressState = "not-started" | "in-progress" | "completed";

export interface ProgressTagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  state?: ProgressState | null;
  className?: string;
}

export function ProgressTag({ state = null, className }: ProgressTagProps) {
  if (state == null) {
    return null;
  }

  const t = useT();
  const config = STATE_PROGRESS_TAG[state];

  return (
    <Tag.Root
      className={classNames(
        "box-shadow-none flex w-fit items-center gap-2 rounded-full border-2 bg-white px-2 py-1 shadow-none",
        {
          "border-theme-neutral-400": state === "not-started",
          "border-theme-primary-400": state === "in-progress",
          "border-theme-success-300": state === "completed"
        },
        className
      )}
    >
      <Tag.Label className="flex items-center gap-2">
        {config?.icon}
        <Text color="netral.900" textStyle="200">
          {t("Planting: ")}
          <Text color="netral.900" textStyle="300-bold" as="span">
            {t(config.label)}
          </Text>
        </Text>
      </Tag.Label>
    </Tag.Root>
  );
}
