import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useState } from "react";

import type { PolygonEditDrawerPolygon } from "@/context/polygonEditDrawer.types";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import NotificationIndicator from "@/redesignComponents/navigation/NotificationIndicator/NotificationIndicator";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";

import PolygonEditContent from "./PolygonEditContent";

interface PolygonEditDrawerProps {
  open?: boolean;
  polygon?: PolygonEditDrawerPolygon;
  selectedPolygon?: SitePolygonLightDto;
  onOpenChange?: (open: boolean) => void;
  onSaved?: () => unknown | Promise<unknown>;
  onPolygonUpdated?: (polygon: SitePolygonLightDto) => void;
}

const PolygonEditDrawer: FC<PolygonEditDrawerProps> = ({
  open,
  polygon,
  selectedPolygon,
  onOpenChange,
  onSaved,
  onPolygonUpdated
}) => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [saveEditContent, setSaveEditContent] = useState<(() => Promise<boolean>) | null>(null);

  useEffect(() => {
    setSaveEditContent(null);
  }, [selectedPolygon?.uuid]);

  const registerSave = useCallback((saveHandler: () => Promise<boolean>) => {
    setSaveEditContent(() => saveHandler);
  }, []);

  const handleSave = useCallback(
    async (onClose: () => void) => {
      if (activeTab !== "edit" || saveEditContent == null) {
        onClose();
        return;
      }

      const saved = await saveEditContent();
      if (saved) {
        onClose();
      }
    },
    [activeTab, saveEditContent]
  );

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
          title={selectedPolygon?.name ?? polygon?.polygonName ?? "-"}
          variant="fixed"
          onClose={onClose}
          className="h-screen w-full"
          content={
            <Flex className="h-full flex-col gap-3">
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
              {activeTab === "edit" && (
                <PolygonEditContent
                  polygon={selectedPolygon}
                  onClose={onClose}
                  onRegisterSave={registerSave}
                  onSaved={onSaved}
                  onPolygonUpdated={onPolygonUpdated}
                />
              )}
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
                  onClick: () => void handleSave(onClose)
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
