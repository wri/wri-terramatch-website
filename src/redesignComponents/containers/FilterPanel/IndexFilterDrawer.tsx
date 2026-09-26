import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { SizeValue } from "@/lib/sizing";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import { DrawerPlacement } from "@/redesignComponents/containers/Drawer/Drawer.types";

import FilterPanel from "./FilterPanel";

export type IndexFilterDrawerTag = {
  id: string;
  label: string;
};

type IndexFilterDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tags: IndexFilterDrawerTag[];
  onRemoveTag: (id: string) => void;
  onClear: () => void;
  onApply: () => void;
  children: ReactNode;
  drawerSize?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | "filterPanel";
  drawerPlacement?: DrawerPlacement;
  drawerMaxW?: SizeValue;
  drawerPaddingTop?: SizeValue;
  drawerPaddingLeft?: SizeValue;
  drawerMaxH?: SizeValue;
  panelClassName?: string;
};

const IndexFilterDrawer: FC<IndexFilterDrawerProps> = ({
  open,
  onOpenChange,
  tags,
  onRemoveTag,
  onClear,
  onApply,
  children,
  drawerSize,
  drawerPlacement,
  drawerMaxW,
  drawerPaddingTop,
  drawerPaddingLeft,
  drawerMaxH,
  panelClassName
}) => {
  const t = useT();

  return (
    <Drawer
      trapFocus={false}
      open={open}
      onOpenChange={onOpenChange}
      size={drawerSize}
      placement={drawerPlacement}
      maxW={drawerMaxW}
      paddingTop={drawerPaddingTop}
      paddingLeft={drawerPaddingLeft}
      maxH={drawerMaxH}
    >
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className={twMerge("h-full", panelClassName)}
          content={
            <Flex className="h-full flex-col gap-3 overflow-auto p-4">
              <Flex className="mb-2 flex-wrap gap-2" display={tags.length > 0 ? "flex" : "none"}>
                {tags.map(tag => (
                  <FeedbackTag
                    key={tag.id}
                    type="info-white"
                    label={tag.label}
                    closable
                    onClose={() => onRemoveTag(tag.id)}
                  />
                ))}
              </Flex>
              {children}
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  id: "clear-all",
                  children: t("Clear all"),
                  variant: "secondary",
                  onClick: onClear
                },
                {
                  id: "apply",
                  children: t("Apply"),
                  variant: "primary",
                  onClick: () => {
                    onApply();
                    onClose();
                  }
                }
              ]}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default IndexFilterDrawer;
