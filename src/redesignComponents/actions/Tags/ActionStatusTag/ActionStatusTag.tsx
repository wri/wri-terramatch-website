import { Span, Tag } from "@chakra-ui/react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { type ActionStatusTagProps } from "./ActionStatusTag.type";
import { ACTION_STATUS_TAG_MAP } from "./constants";

const ActionStatusTag: FC<ActionStatusTagProps> = ({ state, className, size = "default", label, icon }) => {
  const stateClassName = state ? ACTION_STATUS_TAG_MAP[state].className : undefined;

  return (
    <Tag.Root
      className={twMerge(
        "box-shadow-none flex h-fit w-fit items-center gap-1 rounded-full border px-2 py-1 shadow-none",
        stateClassName,
        className
      )}
    >
      {icon}
      <Tag.Label>
        <Span textStyle={size === "default" ? "300-bold" : "200-bold"}>{label}</Span>
      </Tag.Label>
    </Tag.Root>
  );
};

export default ActionStatusTag;
