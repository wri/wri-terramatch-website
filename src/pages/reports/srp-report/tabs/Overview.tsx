import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import StatusTag from "@/components/elements/StatusTag/StatusTag";
import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { PENDING_APPROVAL } from "@/constants/statuses";
import { SrpReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { ChevronRightIcon, EditIcon, NewTabIcon, PartnersIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";

type SrpReportOverviewTabProps = {
  report: SrpReportFullDto;
  onViewDetails: () => void;
};

const getRestorationPartnersStepStatus = (report: SrpReportFullDto): StepProps["status"] => {
  if (report.status === "information-required" || report.updateRequestStatus === "information-required") {
    return "error";
  }
  if (report.status === "approved" || report.status === "pending-approval" || report.completion === 100) {
    return "completed";
  }
  return "available";
};

const SrpReportOverviewTab: FC<SrpReportOverviewTabProps> = ({ report, onViewDetails }) => {
  const t = useT();

  const statusTag = useMemo(() => {
    if (report.updateRequestStatus === PENDING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    return <StatusTag size="small" status={report.status} />;
  }, [report.status, report.updateRequestStatus]);

  if (report.nothingToReport) {
    return (
      <PageContent>
        <NothingToReportEmptyState />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Flex gap={7} direction="column" width="100%">
        <Flex gap={7} direction={{ base: "column", lg: "row" }} alignItems={{ lg: "flex-start" }}>
          <PageItem
            title={t("Key Indicators")}
            flexProps={{ flex: 2, minWidth: 0, width: "100%" }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View Report Details"),
              rightIcon: <ChevronRightIcon />,
              onClick: onViewDetails
            }}
          >
            <MetricCardsRow>
              <MetricCard
                title={t("Total Unique Restoration Partners")}
                progress={report.totalUniqueRestorationPartners ?? 0}
                goal={0}
                variant="large"
                icon={<PartnersIcon />}
                color="primary.700"
                metricLabel="total_unique_restoration_partners"
                tooltipContent={t(
                  "This is the total number of unique restoration partners reported during this reporting period."
                )}
                className="flex-none"
              />
            </MetricCardsRow>
          </PageItem>
          <PageItem
            title={t("SRP Report")}
            flexProps={{ flex: 1, minWidth: 0, width: "100%" }}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: t("Continue"),
              rightIcon: <ChevronRightIcon />,
              onClick: onViewDetails
            }}
            tag={statusTag}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <ProgressSteps
                steps={[
                  {
                    index: 1,
                    status: getRestorationPartnersStepStatus(report),
                    label: t("Restoration Partners"),
                    actions: (
                      <Button
                        type="button"
                        variant="borderless"
                        size="small"
                        leftIcon={<EditIcon boxSize={3} />}
                        onClick={onViewDetails}
                      >
                        {t("Edit")}
                      </Button>
                    ),
                    onClick: onViewDetails
                  }
                ]}
              />
            </Box>
          </PageItem>
        </Flex>
        <PageItem title={t("About SRP Report")} flexProps={{ width: "100%" }}>
          <Flex direction="column" gap={2} backgroundColor="neutral.100" padding={5} borderRadius={1}>
            <Flex direction="column" gap={5}>
              <Flex direction="column" gap={4}>
                <Text color="neutral.900" textStyle="300">
                  {t("The Annual ")}
                  <Text as="strong" textStyle="300-bold">
                    {t("Socioeconomic Restoration Partners Report ")}
                  </Text>
                  {t(
                    "captures who participated in restoration activities, how partners were engaged, and the socioeconomic outcomes reported for the current reporting period. Metrics represent this period only and do not indicate progress toward a target."
                  )}
                </Text>
                <Text color="neutral.900" textStyle="300">
                  {t(
                    "Accurate and detailed reporting ensures your work is fully represented, supports transparency and accountability, and helps TerraFund track portfolio progress towards restoration goals. WRI has created a "
                  )}
                  <Link href="#guidance-document" textStyle="300-bold" textDecoration="underline">
                    {t("guidance document")}
                  </Link>
                  {t(" to help you report clearly and thoroughly.")}
                </Text>
              </Flex>
              <ContactSupport
                message={t(
                  "Gather all required data before you begin and contact your project manager or if you need assistance"
                )}
                subject="Support Request for SRP Report"
              />
            </Flex>

            <Flex id="guidance-document" direction="column" gap={2}>
              <Text color="neutral.900" textStyle="500-bold">
                {t("Helpful Links")}
              </Text>
              <SimpleDivider />
              <Flex direction="column" paddingTop={1.5} gap={2} alignItems="flex-start">
                <Button
                  as="a"
                  href="#checklists"
                  variant="borderless"
                  size="small"
                  rightIcon={<NewTabIcon boxSize="0.625rem" />}
                  className="justify-start truncate !whitespace-nowrap mobile:max-w-full mobile:[text-wrap:auto]"
                >
                  {t("Checklists for your TerraFund Reports")}
                </Button>
                <Text id="checklists" color="neutral.900" textStyle="300">
                  {t("We will add more guidance coming from the guidance being developed by the program team!")}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default SrpReportOverviewTab;
