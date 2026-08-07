import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { PlusIcon, ReportsIcon } from "@/redesignComponents/foundations/Icons";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";
import Toolbar from "@/redesignComponents/navigation/Toolbar/Toolbar";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";

type ReportsIndexHeaderProps = {
  activeTab: string;
  selectedViewLabel: string;
  onTabChange: (tab: string) => void;
};

const ReportsIndexHeader = ({ activeTab, selectedViewLabel, onTabChange }: ReportsIndexHeaderProps) => {
  const t = useT();
  const router = useRouter();

  return (
    <div className="bg-white">
      <ToolbarObject
        className="border-theme-neutral-300 border-b !px-6"
        breadcrumbs={{
          links: [
            {
              label: t("Reports"),
              link: router.asPath,
              icon: <ReportsIcon className="text-theme-primary-900" />
            }
          ],
          linkRouter: router,
          size: "small"
        }}
      />
      <PageHeader
        className="!bg-theme-neutral-100"
        title={t("Reports")}
        actions={
          <Button size="small" leftIcon={<PlusIcon boxSize="10px" />}>
            {t("Add Disturbance Report")}
          </Button>
        }
      />
      <Toolbar
        className="border-theme-neutral-200 items-end border-b !px-3 mobile:flex-col mobile:!items-stretch mobile:gap-3"
        classNameContentLeft="min-w-0"
        classNameContentRight="mt-[-1.25rem]"
        contentLeft={
          <TabBar
            key={activeTab}
            variant="transparent"
            defaultValue={activeTab}
            tabs={[
              { value: "progress-reports", label: t("Progress Reports") },
              { value: "additional-reports", label: t("Additional Reports") }
            ]}
            onTabClick={onTabChange}
          />
        }
        contentRight={
          <HighLevelSelector
            label={t("View:")}
            items={[{ label: selectedViewLabel, value: "current-view" }]}
            value="current-view"
            width="400px"
            className="mobile:!w-full"
          />
        }
      />
    </div>
  );
};

export default ReportsIndexHeader;
