import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import About from "@/components/extensive/PageElements/About/About";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
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
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import {
  AreaHectaresIcon,
  ChevronRightIcon,
  RegenerationIcon,
  SeedlingsIcon,
  SurvivalRateIcon
} from "@/redesignComponents/foundations/Icons";
import { TreeIcon } from "@/redesignComponents/foundations/Icons";

import { ABOUT_SITES_CONTENT } from "./constants/AboutSites.constants";
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

  const mockedFrameworkKey = "ppc";

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reload}>
      <PageBody>
        <Flex direction="column" gap={5} paddingX={6} paddingBottom={4}>
          <Flex gap={7}>
            <PageItem
              title="Site Map"
              flexProps={{ flex: 1 }}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: "View all Areas",
                rightIcon: <ChevronRightIcon />,
                onClick: () => {}
              }}
            >
              <Box className="relative h-auto">
                <OverviewMapArea
                  entityModel={site}
                  type="sites"
                  className="max-h-[432px]"
                  disabledPolygonPanel={true}
                />
              </Box>
            </PageItem>
            <PageItem
              flexProps={{ width: "fit-content", maxWidth: "30%", overflow: "hidden" }}
              title="Sites Set Up"
              tag={<TagSubmission state="information-required" />}
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
            title="Key Indicators & Insights"
            flexProps={{ paddingY: 2, width: "100%" }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "View Progress & Goals",
              rightIcon: <ChevronRightIcon />
            }}
          >
            <Flex gap={4}>
              <MetricCard
                className="flex-1"
                title="Trees Planted"
                variant="large"
                progress={0}
                goal={100}
                icon={<TreeIcon />}
                tooltipContent="This is a tooltip"
                color="secondary.600"
              />
              <MetricCard
                className="flex-1"
                title="Seeds Planted"
                variant="large"
                progress={50}
                goal={100}
                icon={<SeedlingsIcon />}
                tooltipContent="This is a tooltip"
                color="secondary.600"
              />
              <MetricCard
                className="flex-1"
                title="Trees Regenerating"
                variant="large"
                progress={25}
                goal={100}
                icon={<RegenerationIcon />}
                tooltipContent="This is a tooltip"
                color="secondary.600"
              />
              <MetricCard
                className="flex-1"
                title="Survival Rate"
                variant="large"
                progress={75}
                goal={100}
                icon={<SurvivalRateIcon />}
                tooltipContent="This is a tooltip"
                color="secondary.600"
              />
              <MetricCard
                className="flex-1"
                title="Area Restored (ha)"
                variant="large"
                progress={100}
                goal={100}
                icon={<AreaHectaresIcon />}
                tooltipContent="This is a tooltip"
                color="secondary.700"
              />
            </Flex>
          </PageItem>
          <Flex gap={7} maxHeight="570px" paddingY={2}>
            <PageItem
              title="Latest Images"
              flexProps={{ flex: 1 }}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: "View Gallery",
                rightIcon: <ChevronRightIcon />
              }}
            >
              <LastestImagesSectionTab entityUuid={site.uuid} entityName="sites" columns={3} />
            </PageItem>
            <PageItem title={ABOUT_SITES_CONTENT[mockedFrameworkKey].title}>
              <About
                description={
                  <Flex direction="column" gap={5}>
                    <Text color="neutral.900" textStyle="300">
                      <strong>{t("Sites")} </strong>
                      {t(ABOUT_SITES_CONTENT[mockedFrameworkKey].content[0])}
                    </Text>
                    <Text color="neutral.900" textStyle="300">
                      {t(ABOUT_SITES_CONTENT[mockedFrameworkKey].content[1])}
                      <Button variant="borderless" size="small" rightIcon={<ChevronRightIcon />} as="span">
                        {t("info@terramatch.org")}
                      </Button>
                    </Text>
                  </Flex>
                }
                links={ABOUT_SITES_CONTENT[mockedFrameworkKey].links.map(link => ({
                  title: link.title,
                  link: link.link
                }))}
              />
            </PageItem>
          </Flex>
        </Flex>
      </PageBody>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;
