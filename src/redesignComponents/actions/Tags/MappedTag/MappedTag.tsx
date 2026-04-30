import { Span, Tag } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { ICON_MAP } from "./constants";
import { type MappedTagProps, MappedTagState } from "./MappedTag.type";

export const useTagLabel = (tag: MappedTagState) => {
  const t = useT();
  const map = {
    draft: t("Draft"),
    "nothing-reported": t("Nothing Reported"),
    "pending-approval-neutral": t("Pending Approval"),
    "pending-approval": t("Pending Approval"),
    "information-required": t("Information Required"),
    approved: t("Approved"),
    due: t("Due")
  };

  return map[tag];
};

const MappedTag: FC<MappedTagProps> = ({ state, className, size = "default" }) => {
  const label = useTagLabel(state);
  const iconConfig = ICON_MAP[state];
  const IconComponent = iconConfig.component;

  return (
    <Tag.Root
      className={classNames(
        "box-shadow-none border-theme-neutral-300 bg-theme-neutral-100 flex h-fit w-fit items-center gap-2 rounded-full border px-2 py-1 shadow-none",
        className
      )}
    >
      <Tag.Label className="flex items-center gap-1">
        <IconComponent
          color={iconConfig.color}
          boxSize={iconConfig.boxSize}
          className={
            iconConfig.useDynamicSize
              ? classNames({
                  "h-3 w-3": size === "default",
                  "h-2.5 w-2.5": size === "small"
                })
              : iconConfig.className
          }
        />
        <Span color="neutral.800" textStyle={size === "default" ? "300-bold" : "200-bold"}>
          {label}
        </Span>
      </Tag.Label>
    </Tag.Root>
  );
};

export default MappedTag;
