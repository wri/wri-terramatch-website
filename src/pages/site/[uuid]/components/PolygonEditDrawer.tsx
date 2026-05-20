import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useState } from "react";

import type { PolygonEditDrawerPolygon } from "@/context/polygonEditDrawer.types";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import NotificationIndicator from "@/redesignComponents/navigation/NotificationIndicator/NotificationIndicator";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";

import PolygonEditContent from "./PolygonEditContent";

interface PolygonEditDrawerProps {
  open?: boolean;
  polygon?: PolygonEditDrawerPolygon | null;
  onOpenChange?: (open: boolean) => void;
}

const PolygonEditDrawer: FC<PolygonEditDrawerProps> = ({ open, polygon, onOpenChange }) => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<string>("edit");

  return (
    <Drawer
      modal={false}
      open={open}
      closeOnInteractOutside={false}
      onOpenChange={onOpenChange}
      size="md"
      placement="start"
    >
      {({ onClose }) => (
        <FilterPanel
          title={polygon != null ? polygon?.polygonName ?? t("-") : t("New Polygon")}
          variant="fixed"
          onClose={onClose}
          className="h-screen w-full"
          content={
            <Flex className="h-full flex-col gap-3">
              {polygon != null && (
                <TabBar
                  onTabClick={(tabValue: string) => setActiveTab(tabValue)}
                  tabs={[
                    {
                      label: t("Edit"),
                      value: "edit"
                    },
                    {
                      label: t("System Validation"),
                      value: "systemValidation"
                    },
                    {
                      label: (
                        <Text className="flex items-center gap-2">
                          {t("Comments")}
                          <NotificationIndicator bgColor={activeTab != "comments" ? "neutral.700" : undefined}>
                            3
                          </NotificationIndicator>
                        </Text>
                      ),
                      value: "comments"
                    }
                  ]}
                  variant="panel"
                />
              )}

              {activeTab === "edit" && <PolygonEditContent />}
              {activeTab === "systemValidation" && <div>System Validation</div>}
              {activeTab === "comments" && <div>Comments</div>}
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  children: t("Cancel"),
                  variant: "secondary",
                  onClick: onClose
                },
                {
                  children: t("Save"),
                  variant: "primary",
                  onClick: onClose
                }
              ]}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default PolygonEditDrawer;
