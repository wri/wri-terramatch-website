import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useEffect } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import About from "@/components/extensive/PageElements/About/About";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
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
interface SiteOverviewTabProps {
  site: SiteFullDto;
  refetch?: () => void;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const contextMapArea = useMapAreaContext();
  const { setSiteData } = contextMapArea;

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

  const mockecBoolean = false;

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
                children: mockecBoolean ? t("Edit") : t("Continue"),
                rightIcon: <ChevronRightIcon />
              }}
            >
              <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
                <EntitySetUpSection entity={site} type="sites" />
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
              <LastestImagesSectionTab entityUuid={site.uuid} entityName="sites" />
            </PageItem>
            <PageItem title="Project Onboarding">
              <About
                description={
                  <Flex direction="column" gap={5}>
                    <Text color="neutral.900" textStyle="300">
                      <strong>{t("Sites")}: </strong>
                      {t(
                        "are the core units for reporting your restoration work in TerraMatch. Each site can include one or more restoration areas or polygons and should reflect a meaningful geographic grouping for your project."
                      )}
                    </Text>
                    <Flex alignItems="center" flexWrap="wrap">
                      <Text color="neutral.900" textStyle="300">
                        {t(
                          "Keep your site profiles up to date to track progress, report challenges, and share successes. If you have challenges or need assistance, please reach out to your project manager or"
                        )}
                      </Text>
                      <Button variant="borderless" size="small" rightIcon={<ChevronRightIcon />}>
                        {t("info@terramatch.org")}
                      </Button>
                    </Flex>
                  </Flex>
                }
                links={[
                  {
                    title: "Follow the TerraFund Siting Guide ",
                    link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Polygons-to-TerraMatch-Sites"
                  },
                  {
                    title: "Use the TerraFund Profile Creation Checklist ",
                    link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Polygons-to-TerraMatch-Sites"
                  },
                  {
                    title: "Create a Site Profile",
                    link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Polygons-to-TerraMatch-Sites"
                  },
                  {
                    title: "Use the Site Profile Polygon Guide",
                    link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Polygons-to-TerraMatch-Sites"
                  },
                  {
                    title: "Download & Use Greenhouse.Flority",
                    link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Polygons-to-TerraMatch-Sites"
                  }
                ]}
              />
            </PageItem>
          </Flex>
        </Flex>
      </PageBody>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;
