import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import router from "next/router";
import { useEffect, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import About from "@/components/extensive/PageElements/About/About";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LastestImagesSectionTab from "@/pages/project/[uuid]/tabs/LastestImagesSection";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission.type";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import { ABOUT_SITES_CONTENT } from "./constants/AboutSites.constants";
import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";
interface SiteOverviewTabProps {
  site: SiteFullDto;
  refetch?: () => void;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const contextMapArea = useMapAreaContext();
  const { setSiteData } = contextMapArea;
  const [isSiteSetupComplete, setIsSiteSetupComplete] = useState(false);

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.uuid,
    entityStatus: site.status ?? "started",
    updateRequestStatus: site.updateRequestStatus ?? "no-update"
  });

  const { data: sitePolygonDataV3, refetch: refetchV3 } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: !!site.uuid
  });
  const reload = () => {
    refetchV3();
  };
  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };

  const aboutSitesContentItem = useMemo(() => {
    return ABOUT_SITES_CONTENT.find(content => content.frameworks.includes(site.frameworkKey!));
  }, [site.frameworkKey]);

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reload}>
      <PageContent>
        <Flex gap={7}>
          <PageItem
            title={t("Site Map")}
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "View all Areas",
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("map")
            }}
          >
            <Box className="relative h-auto">
              <OverviewMapArea entityModel={site} type="sites" className="max-h-[432px]" disabledPolygonPanel={true} />
            </Box>
          </PageItem>
          <PageItem
            flexProps={{ width: "fit-content", maxWidth: "30%", overflow: "hidden" }}
            title={t("Sites Set Up")}
            tag={(() => {
              const tagState = mapStatusToTagStateEntity(site?.status);

              return site?.status != null ? <TagSubmission state={tagState?.type as TagSubmissionState} /> : null;
            })()}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: isSiteSetupComplete ? t("Edit") : t("Continue"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => handleEdit()
            }}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <EntitySetUpSection onStatusChange={setIsSiteSetupComplete} entity={site} type="sites" />
            </Box>
          </PageItem>
        </Flex>
        <PageItem
          title={t("Key Indicators & Insights")}
          flexProps={{ paddingY: 2, width: "100%" }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("View Progress & Goals"),
            rightIcon: <ChevronRightIcon />,
            onClick: () => goToTab("goals")
          }}
        >
          <Flex gap={4}>
            <KeyIndicatorsInsightsTab site={site} />
          </Flex>
        </PageItem>
        <Flex gap={7} maxHeight="570px" paddingY={2}>
          <PageItem
            title={t("Latest Images")}
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View Gallery"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("gallery")
            }}
          >
            <LastestImagesSectionTab entityUuid={site.uuid} entityName="sites" columns={3} />
          </PageItem>
          <PageItem title={t(aboutSitesContentItem?.title!)}>
            <About
              description={
                <Flex direction="column" gap={5}>
                  <Text color="neutral.900" textStyle="300">
                    <strong>{t("Sites")} </strong>
                    {t(aboutSitesContentItem?.paragraph1!)}
                  </Text>
                  <Text color="neutral.900" textStyle="300">
                    {t(aboutSitesContentItem?.paragraph2!)}
                    <Button variant="borderless" size="small" rightIcon={<ChevronRightIcon />} as="span">
                      info@terramatch.org
                    </Button>
                  </Text>
                </Flex>
              }
              links={
                aboutSitesContentItem?.links.map(link => ({
                  title: t(link.title),
                  link: link.link
                })) ?? []
              }
            />
          </PageItem>
        </Flex>
      </PageContent>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;
