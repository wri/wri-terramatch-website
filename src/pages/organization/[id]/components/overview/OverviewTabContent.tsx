import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useModalContext } from "@/context/modal.provider";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import OrganizationEditModal from "../edit/OrganizationEditModal";
import About from "./About";
import FinancialCharts from "./FinancialCharts";
import KeyIndicatorsInsights from "./KeyIndicatorsInsights";
import {
  MOCK_LATEST_FINANCIAL_REPORT,
  MOCK_ORGANISATION,
  MOCK_ORGANISATION_PROJECTS,
  MOCK_SET_UP_STEPS
} from "./organizationOverview.mock";
import OrganizationSetUpSection from "./OrganizationSetUpSection";

type OverviewTabContentProps = {
  organization?: OrganisationFullDto;
};

const OverviewTabContent: FC<OverviewTabContentProps> = ({ organization }) => {
  const t = useT();
  const router = useRouter();
  const { openModal } = useModalContext();

  // TODO TM-4219: replace the mock data with the organization's real data.
  const { description, type } = MOCK_ORGANISATION;
  const hasDescription = description != null && description.trim() !== "";
  const projects = MOCK_ORGANISATION_PROJECTS;
  const latestFinancialReport = MOCK_LATEST_FINANCIAL_REPORT;
  const setUpSteps = MOCK_SET_UP_STEPS;
  const isSetUpComplete = setUpSteps.every(({ completed }) => completed);

  const goToTab = useCallback(
    (tab: string) => router.push(`/organization/${router.query.id}?tab=${tab}`, undefined, { shallow: true }),
    [router]
  );

  const handleEdit = useCallback(
    () => openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />),
    [openModal, organization]
  );

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
                    onClick: () => goToTab("organization_details")
                  }
                : undefined
            }
          >
            <About description={hasDescription ? description : null} onAddInformation={handleEdit} />
          </PageItem>
          <PageItem title={t("Key Indicators & Insights")} flexProps={{ gap: 2 }}>
            <Flex alignItems="center" gap={1}>
              <Text textStyle="200" color="neutral.700">
                {t("Across")}
              </Text>
              <Button type="button" variant="borderless" size="small" onClick={() => goToTab("projects")}>
                {t("{count} Projects", { count: projects.length })}
              </Button>
            </Flex>
            <KeyIndicatorsInsights projects={projects} />
          </PageItem>
          <PageItem
            title={t("Organization Financials")}
            flexProps={{ gap: 2 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View Latest Report"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => router.push(`/reports/financial-report/${latestFinancialReport.uuid}`)
            }}
          >
            <Text textStyle="200" color="neutral.700">
              {t("Annual figures for the whole organization, from its financial history")}
            </Text>
            <FinancialCharts report={latestFinancialReport} organisationType={type} />
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
