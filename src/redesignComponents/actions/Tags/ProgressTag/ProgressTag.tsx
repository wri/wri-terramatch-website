import { Tag } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { STATE_PROGRESS_TAG } from "./constants/stateProgressTag";

export type ProgressState = "not-started" | "in-progress" | "complete";

export interface ProgressTagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  state?: ProgressState;
  className?: string;
}

export function ProgressTag({ state = "not-started", className }: ProgressTagProps) {
  const t = useT();
  const config = STATE_PROGRESS_TAG[state];

  return (
    <Tag.Root
      className={classNames(
        "box-shadow-none flex w-fit items-center gap-2 rounded-full border-2 bg-white px-2 py-1 shadow-none",
        {
          "border-theme-neutral-400": state === "not-started",
          "border-theme-primary-400": state === "in-progress",
          "border-theme-success-300": state === "complete"
        },
        className
      )}
    >
      <Tag.Label className="flex items-center gap-2">
        {config?.icon}
        <span className="text-nowrap whitespace-nowrap text-sm font-bold text-theme-neutral-900">
          {t(config.label)}
        </span>
      </Tag.Label>
    </Tag.Root>
  );
}
