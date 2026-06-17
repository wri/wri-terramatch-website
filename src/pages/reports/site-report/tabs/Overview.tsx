import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import About from "@/components/extensive/PageElements/About/About";
import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import SiteReportKeyIndicatorsInsights from "@/pages/reports/site-report/components/KeyIndicatorsInsights";
import { useSiteReportAboutContent } from "@/pages/reports/site-report/constants/siteReportAboutContent";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

interface OverviewProps {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto | null;
}

const Overview: FC<OverviewProps> = ({ siteReport, site }) => {
  const router = useRouter();
  const t = useT();
  const { openModal } = useModalContext();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);
  const siteReportAboutContent = useSiteReportAboutContent();

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "site-reports",
    entityUUID: siteReport.uuid,
    entityStatus: siteReport.status,
    updateRequestStatus: siteReport.updateRequestStatus
  });

  const needMoreInformation =
    siteReport.updateRequestStatus === NEEDS_MORE_INFORMATION || siteReport.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval =
    siteReport.updateRequestStatus === AWAITING_APPROVAL || siteReport.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, siteReport, siteReport.status), [t, siteReport]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval && statusProps != null) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps}
          feedback={siteReport.feedback}
          needMoreInformation={needMoreInformation}
          entityName="siteReports"
          entityUuid={siteReport.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [awaitingApproval, handleEdit, needMoreInformation, openModal, siteReport.feedback, siteReport.uuid, statusProps]);

  const goToTab = useCallback(
    (tab: string) => {
      router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
        shallow: true
      });
    },
    [router]
  );

  const aboutContentItem = useMemo(() => {
    return siteReportAboutContent.find(content => content.frameworks.includes(siteReport.frameworkKey!));
  }, [siteReport.frameworkKey, siteReportAboutContent]);

  const editButtonLabel = siteReport.status === "approved" && isReportSetupComplete ? t("Edit") : t("Continue");

  const statusTag = useMemo(() => {
    if (siteReport.updateRequestStatus === AWAITING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    const tagState = mapStatusToTagStateEntity(siteReport.status);
    if (siteReport.status == null || tagState == null) return null;

    return <TagSubmission size="small" state={tagState.type} />;
  }, [siteReport.status, siteReport.updateRequestStatus]);

  if (siteReport.nothingToReport) {
    return (
      <PageContent>
        <EmptyState
          iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
          title={t("Nothing to report")}
          subtitle={t(
            "You've marked this report as 'Nothing to Report,' indicating there are no updates for this site report. If you wish to add information to this report, please use the edit button."
          )}
        />
      </PageContent>
    );
  }

  const isHBFFramework = siteReport.frameworkKey === Framework.HBF;

  return (
    <PageContent>
      <Flex gap={7} className="flex-col">
        <Flex gap={7}>
          <Flex gap={5} className={classNames(isHBFFramework ? "flex-row" : "flex-col", "flex-[2]")}>
            <PageItem title={t("Key Indicators & Insights")}>
              <SiteReportKeyIndicatorsInsights siteReport={siteReport} />
            </PageItem>
            <PageItem
              title={t("Featured Images")}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: t("View Gallery"),
                rightIcon: <ChevronRightIcon />,
                onClick: () => goToTab("gallery")
              }}
            >
              <LatestImagesSectionTab
                entityUuid={siteReport.uuid}
                entityName="siteReports"
                columns={isHBFFramework ? 2 : 4}
                rows={1}
              />
            </PageItem>
          </Flex>
          <PageItem
            title={t("Site Report")}
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
              <EntitySetUpSection onStatusChange={setIsReportSetupComplete} entity={siteReport} type="siteReports" />
            </Box>
          </PageItem>
        </Flex>
        <PageItem title={t("About Site Report")} flexProps={{ flex: 1 }}>
          <About
            description={
              <Flex direction="column" gap={5}>
                {aboutContentItem?.paragraphs.map((paragraph, index) => {
                  const isLastParagraph = index === (aboutContentItem.paragraphs.length ?? 0) - 1;

                  if (isLastParagraph) {
                    return (
                      <ContactSupport key={index} message={paragraph} subject={t("Support Request for Site Report")} />
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

export default Overview;
