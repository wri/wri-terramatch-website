import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ChartEmptyState from "@/redesignComponents/dataDisplay/Charts/ChartEmptyState";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import { useOrganizationEditModal } from "../edit/useOrganizationEditModal";
import About from "./About";
import FinancialCharts from "./FinancialCharts";
import KeyIndicatorsInsights from "./KeyIndicatorsInsights";
import OrganizationSetUpSection from "./OrganizationSetUpSection";
import { useOrganisationOverview } from "./useOrganisationOverview";

type OverviewTabContentProps = {
  organization?: OrganisationFullDto;
  navigateToTab: (tab: string) => void;
};

const OverviewTabContent: FC<OverviewTabContentProps> = ({ organization, navigateToTab }) => {
  const t = useT();
  const router = useRouter();
  const handleEdit = useOrganizationEditModal(organization);

  const { description, type, projects, latestFinancialReport, setUpSteps } = useOrganisationOverview(organization);
  const hasDescription = description != null && description.trim() !== "";
  const isSetUpComplete = setUpSteps.every(({ completed }) => completed);
  const latestReportUuid = latestFinancialReport?.uuid;

  const goToDetails = useCallback(() => navigateToTab("organization_details"), [navigateToTab]);
  const goToProjects = useCallback(() => navigateToTab("projects"), [navigateToTab]);
  const goToLatestReport = useCallback(() => {
    if (latestReportUuid != null) router.push(`/reports/financial-report/${latestReportUuid}`);
  }, [latestReportUuid, router]);

  return (
    <PageContent>
      <Flex gap={7} className="flex-col sm:flex-row">
        <Flex className="flex-[2] flex-col gap-7 mobile:flex-[1]">
          <PageItem
            title={t("About")}
            buttonProps={
              hasDescription
                ? {
                    variant: "secondary",
                    size: "small",
                    children: t("Read More"),
                    rightIcon: <ChevronRightIcon />,
                    onClick: goToDetails
                  }
                : undefined
            }
          >
            <About description={hasDescription ? description : null} onAddInformation={handleEdit} />
          </PageItem>
          <PageItem title={t("Key Indicators & Insights")} flexProps={{ gap: 2 }}>
            {projects.length > 0 && (
              <Flex alignItems="center" gap={1}>
                <Text textStyle="200" color="neutral.700">
                  {t("Across")}
                </Text>
                <Button type="button" variant="borderless" size="small" onClick={goToProjects}>
                  {projects.length === 1 ? t("1 Project") : t("{count} Projects", { count: projects.length })}
                </Button>
              </Flex>
            )}
            <KeyIndicatorsInsights projects={projects} />
          </PageItem>
          <PageItem
            title={t("Organization Financials")}
            flexProps={{ gap: 2 }}
            buttonProps={
              latestFinancialReport != null
                ? {
                    variant: "secondary",
                    size: "small",
                    children: t("View Latest Report"),
                    rightIcon: <ChevronRightIcon />,
                    onClick: goToLatestReport
                  }
                : undefined
            }
          >
            <Text textStyle="200" color="neutral.700">
              {t("Annual figures for the whole organization, from its financial history")}
            </Text>
            {latestFinancialReport != null ? (
              <FinancialCharts report={latestFinancialReport} organisationType={type} />
            ) : (
              <ChartEmptyState message={t("Charts will appear once this organization submits a financial report.")} />
            )}
          </PageItem>
        </Flex>
        <PageItem
          flexProps={{ width: "fit-content", overflow: "hidden" }}
          className="!w-full !max-w-full flex-[1] sm:!w-[30%] sm:!max-w-[30%]"
          title={t("Organization Set Up")}
          classNameRightSectionHeader="mobile:!w-fit"
          buttonProps={{
            variant: "primary",
            size: "small",
            children: isSetUpComplete ? t("Edit") : t("Continue"),
            rightIcon: <ChevronRightIcon boxSize={4} />,
            onClick: handleEdit
          }}
        >
          <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
            <OrganizationSetUpSection steps={setUpSteps} onEditStep={handleEdit} />
          </Box>
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default OverviewTabContent;
