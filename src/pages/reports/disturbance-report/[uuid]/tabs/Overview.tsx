import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import StatusTag from "@/components/elements/StatusTag/StatusTag";
import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { loadAllSitePolygons } from "@/connections/SitePolygons";
import { PENDING_APPROVAL } from "@/constants/statuses";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { getEntitySetupButtonLabel } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, ChevronRightIcon, PeopleAffectedIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import Log from "@/utils/log";

import { getDisturbanceEntry } from "../index.page";

type PolygonAffectedEntry = { polyUuid: string; polyName: string; siteUuid: string };

const DISTURBANCE_REPORTING_GUIDE_URL =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/50591003474843-How-and-When-to-Report-on-Disturbances-in-your-TerraFund-Project";

type DisturbanceReportOverviewTabProps = {
  report: DisturbanceReportFullDto;
  onViewDetails: () => void;
  onViewGallery: () => void;
};

const DisturbanceReportOverviewTab: FC<DisturbanceReportOverviewTabProps> = ({
  report,
  onViewDetails,
  onViewGallery
}) => {
  const t = useT();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);
  const editButtonLabel = getEntitySetupButtonLabel(t, report.status, isReportSetupComplete);
  const polygonAffected = getDisturbanceEntry("polygon-affected", report);
  const polygonUuidsBySite = useMemo(() => {
    if (polygonAffected === "") return {};
    const parsed = JSON.parse(polygonAffected) as (PolygonAffectedEntry | PolygonAffectedEntry[])[];
    return parsed.flat().reduce<Record<string, string[]>>((acc, polygon) => {
      acc[polygon.siteUuid] = [...(acc[polygon.siteUuid] ?? []), polygon.polyUuid];
      return acc;
    }, {});
  }, [polygonAffected]);
  const affectedSitePolygonUuids = useMemo(() => Object.values(polygonUuidsBySite).flat(), [polygonUuidsBySite]);
  const [polygonsData, setPolygonsData] = useState<SitePolygonLightDto[]>([]);
  const totalAffectedArea = useMemo(
    () => polygonsData.reduce((total, polygon) => total + (polygon.calcArea ?? 0), 0),
    [polygonsData]
  );
  const disturbanceMarkerPoints = useMemo(() => {
    const tooltip = t("Disturbance reported");
    return polygonsData.flatMap<OverlapPolygonPoint>(({ polygonUuid, lat, long }) =>
      polygonUuid == null || lat == null || long == null ? [] : [{ polygonUuid, lat, lng: long, tooltip }]
    );
  }, [polygonsData, t]);
  useEffect(() => {
    const siteEntries = Object.entries(polygonUuidsBySite);
    if (siteEntries.length === 0) {
      setPolygonsData([]);
      return;
    }

    let cancelled = false;
    void Promise.all(
      siteEntries.map(async ([siteUuid, sitePolygonUuids]) => {
        const sitePolygons = await loadAllSitePolygons({ entityName: "sites", entityUuid: siteUuid, enabled: true });
        const affectedUuids = new Set(sitePolygonUuids);
        return sitePolygons.filter(polygon => affectedUuids.has(polygon.uuid));
      })
    )
      .then(results => {
        if (!cancelled) setPolygonsData(results.flat());
      })
      .catch(error => {
        Log.error("Failed to load disturbance report affected polygons", { error });
      });

    return () => {
      cancelled = true;
    };
  }, [polygonUuidsBySite]);

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "disturbance-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    entityTitle: report.projectName ?? "",
    reportTitle: report.title ?? "",
    feedback: report.feedback,
    useStatusModal: true,
    useInformationRequiredModal: true
  });

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
      {EditModals}
      <Flex gap={7} direction="column" width="100%">
        <Flex gap={7} direction={{ base: "column", lg: "row" }} alignItems={{ lg: "flex-start" }}>
          <PageItem
            title={t("Insights")}
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
                title={t("Affected Area")}
                progress={totalAffectedArea}
                progressSuffix={t("ha")}
                goal={0}
                variant="large"
                icon={<AreaHectaresIcon />}
                color="error.900"
                metricLabel="affected_area"
                tooltipContent={t("This is the area where the disturbance occurred.")}
                className="flex-none"
              />
              <MetricCard
                title={t("People Affected")}
                progress={Number(report.entries?.find(entry => entry.name === "people-affected")?.value ?? 0)}
                goal={0}
                variant="large"
                icon={<PeopleAffectedIcon />}
                color="error.900"
                metricLabel="people_affected"
                tooltipContent={t(
                  "This is the estimated total number of individuals impacted over the duration of the disturbance event."
                )}
                className="flex-none"
              />
            </MetricCardsRow>
          </PageItem>
          <PageItem
            title={t("Disturbance Report")}
            flexProps={{ flex: 1, minWidth: 0, width: "100%" }}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: editButtonLabel,
              rightIcon: <ChevronRightIcon />,
              onClick: () => handleEdit()
            }}
            tag={statusTag}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <EntitySetUpSection
                onStatusChange={setIsReportSetupComplete}
                onEditStep={handleEdit}
                entity={report}
                type="disturbanceReports"
                entityTitle={report.projectName ?? ""}
                reportTitle={report.title ?? ""}
              />
            </Box>
          </PageItem>
        </Flex>
        {report.projectUuid != null && (
          <PageItem title={t("Map")} flexProps={{ width: "100%" }} className="min-h-0">
            <Box className="relative overflow-hidden rounded" minH={SITE_POLYGON_MAP_INITIAL_HEIGHT}>
              <OverviewMapArea
                entityModel={{ uuid: report.projectUuid }}
                type="projects"
                className="h-full min-h-0 rounded"
                hideFullscreenControl={true}
                overviewPolygonPopup={true}
                sitePolygonUuids={affectedSitePolygonUuids}
                alertPoints={disturbanceMarkerPoints}
              />
            </Box>
          </PageItem>
        )}
        <Flex gap={7} direction={{ base: "column", lg: "row" }} alignItems={{ lg: "flex-start" }}>
          <PageItem
            title={t("Images")}
            flexProps={{ flex: 1, minWidth: 0, width: "100%" }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View Gallery"),
              rightIcon: <ChevronRightIcon />,
              onClick: onViewGallery
            }}
          >
            <LatestImagesSectionTab
              entityUuid={report.uuid}
              entityName="disturbanceReports"
              columns={3}
              rows={2}
              minItems={6}
            />
          </PageItem>
          <PageItem title={t("About Disturbance Reports")} flexProps={{ flex: 1.2, minWidth: 0, width: "100%" }}>
            <Flex direction="column" gap={6} backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <Text color="neutral.900" textStyle="300">
                <Text as="strong" textStyle="300-bold">
                  {t("Disturbance reports")}
                </Text>{" "}
                {t(
                  "capture and document information on events that affect the success of project restoration activity. The information contained in this report will help project management staff to evaluate the extent of the damage incurred by a disturbance and to determine what support is needed and if any project objectives need to be adjusted. Please report any disturbance within one week of the event and submit a separate report for each disturbance type."
                )}
              </Text>
              <ContactSupport
                message={t(
                  "Reporting disturbances quickly and in detail helps your project manager to support you and adjust your workplan. If you have challenges or need assistance, please reach out to your project manager or"
                )}
                subject="Support Request for Disturbance Report"
              />
              <Flex direction="column" gap={3}>
                <Flex direction="column">
                  <Text color="neutral.900" textStyle="500-bold">
                    {t("Helpful Link")}
                  </Text>
                  <SimpleDivider />
                </Flex>
                <Flex alignItems="flex-start">
                  <Button
                    as="a"
                    href={DISTURBANCE_REPORTING_GUIDE_URL}
                    variant="borderless"
                    size="small"
                    rightIcon={<ChevronRightIcon boxSize="0.625rem" />}
                    className="justify-start truncate !whitespace-nowrap underline mobile:max-w-full mobile:[text-wrap:auto]"
                  >
                    {t("Learn How and When to Report Disturbances")}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </PageItem>
        </Flex>
      </Flex>
    </PageContent>
  );
};

export default DisturbanceReportOverviewTab;
