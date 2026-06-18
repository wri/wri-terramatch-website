import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback, useMemo, useState } from "react";

import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import About from "@/components/extensive/PageElements/About/About";
import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { isTerrafund, toFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";
import { useNurseryReportAboutContent } from "@/pages/reports/nursery-report/constants/nurseryReportAboutContent";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { ChevronRightIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

interface NurseryReportOverviewProps {
  report: NurseryReportFullDto;
}

const NurseryReportOverview: FC<NurseryReportOverviewProps> = ({ report }) => {
  const t = useT();
  const { openModal } = useModalContext();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);
  const nurseryReportAboutContent = useNurseryReportAboutContent();

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nursery-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus
  });

  const needMoreInformation =
    report.updateRequestStatus === NEEDS_MORE_INFORMATION || report.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = report.updateRequestStatus === AWAITING_APPROVAL || report.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, report, report.status), [t, report]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval && statusProps != null) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps}
          feedback={report.feedback}
          needMoreInformation={needMoreInformation}
          entityName="nurseryReports"
          entityUuid={report.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [awaitingApproval, handleEdit, needMoreInformation, openModal, report.feedback, report.uuid, statusProps]);

  const aboutContentItem = useMemo(() => {
    return nurseryReportAboutContent.find(content => content.frameworks.includes(report.frameworkKey!));
  }, [report.frameworkKey, nurseryReportAboutContent]);

  const editButtonLabel = report.status === "approved" && isReportSetupComplete ? t("Edit") : t("Continue");

  const statusTag = useMemo(() => {
    if (report.updateRequestStatus === AWAITING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    const tagState = mapStatusToTagStateEntity(report.status);
    if (report.status == null || tagState == null) return null;

    return <TagSubmission size="small" state={tagState.type} />;
  }, [report.status, report.updateRequestStatus]);

  if (report.nothingToReport) {
    return (
      <PageContent>
        <NothingToReportEmptyState />
      </PageContent>
    );
  }

  const isTerrafundFramework = isTerrafund(toFramework(report.frameworkKey));
  console.log(report.frameworkKey);

  return (
    <PageContent>
      <Flex gap={7} className="flex-col">
        <Flex gap={7}>
          <Flex gap={5} className={classNames(isTerrafundFramework ? "flex-row" : "flex-col", "flex-[2]")}>
            <PageItem title={t("Key Indicators & Insights")}>
              <MetricCardsRow>
                <MetricCard
                  title={t("Seedlings Grown")}
                  progress={0}
                  goal={0}
                  variant="large"
                  icon={<SeedlingsIcon />}
                  color="secondary.600"
                  tooltipContent={t(
                    "This is the total number of seedlings produced in this nursery during this reporting period."
                  )}
                  className="flex-1"
                />
              </MetricCardsRow>
            </PageItem>
            <PageItem title={t("Featured Images")}>
              <LatestImagesSectionTab
                entityUuid={report.uuid}
                entityName="nurseryReports"
                columns={isTerrafundFramework ? 2 : 4}
                rows={1}
                minItems={2}
              />
            </PageItem>
          </Flex>
          <PageItem
            title={t("Nursery Report")}
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: editButtonLabel,
              rightIcon: <ChevronRightIcon />,
              onClick: handleEditClick
            }}
            tag={statusTag}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <EntitySetUpSection onStatusChange={setIsReportSetupComplete} entity={report} type="nurseryReports" />
            </Box>
          </PageItem>
        </Flex>
        <PageItem title={t("About Nursery Report")}>
          <About
            className="flex-row gap-12"
            description={
              <Flex direction="column" gap={5}>
                {aboutContentItem?.paragraphs.map((paragraph, index) => {
                  const isFirstParagraph = index === 0;
                  const isLastParagraph = index === (aboutContentItem.paragraphs.length ?? 0) - 1;

                  if (isFirstParagraph) {
                    return (
                      <Text key={index} color="neutral.900" textStyle="300">
                        <strong>{t("Nursery Report")} </strong> {paragraph}
                      </Text>
                    );
                  }

                  if (isLastParagraph) {
                    return (
                      <ContactSupport
                        key={index}
                        message={paragraph}
                        subject={t("Support Request for Nursery Report")}
                      />
                    );
                  }

                  return (
                    <Text key={index} color="neutral.900" textStyle="300">
                      {paragraph}
                    </Text>
                  );
                })}
              </Flex>
            }
            links={
              aboutContentItem?.links.map(link => ({
                title: t(link.title),
                link: link.link
              })) ?? []
            }
          />
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default NurseryReportOverview;
