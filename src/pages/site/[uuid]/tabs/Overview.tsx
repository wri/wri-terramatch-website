import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ButtonField from "@/components/elements/Field/ButtonField";
import SelectImageListField from "@/components/elements/Field/SelectImageListField";
import TextField from "@/components/elements/Field/TextField";
import Map from "@/components/elements/Map-mapbox/Map";
import Paper from "@/components/elements/Paper/Paper";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useGetV2MODELUUIDImageLocations } from "@/generated/apiComponents";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { useFramework } from "@/hooks/useFramework";
import { useGetOptions } from "@/hooks/useGetOptions";

interface SiteOverviewTabProps {
  site: any;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const { isPPC } = useFramework(site);

  const landUseTypesOptions = useGetOptions(site.land_use_types);
  const restorationStrategyOptions = useGetOptions(site.restoration_strategy);

  const { data: allImages } = useGetV2MODELUUIDImageLocations({
    pathParams: { model: "sites", uuid: site.uuid }
  });

  const imagesGeoJson =
    allImages?.data?.length! > 0
      ? {
          type: "FeatureCollection",
          features: allImages?.data?.map(image => ({
            type: "Feature",
            properties: {
              id: image.uuid,
              image_url: image.thumb_url
            },
            geometry: {
              type: "Point",
              coordinates: [image.location?.lng, image.location?.lat]
            }
          }))
        }
      : undefined;

  const geoJSON = useMemo(() => {
    try {
      if (site.boundary_geojson) {
        return JSON.parse(site.boundary_geojson);
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  }, [site]);

  return (
    <PageBody>
      <PageRow>
        <PageCard
          title={t("Progress & Goals")}
          headerChildren={
            <Button
              as={Link}
              variant="secondary"
              className="m-auto"
              href={getEntityDetailPageLink("sites", router.query.uuid as string, "goals")}
              shallow
            >
              {t("View all")}
            </Button>
          }
        >
          <div className="flex w-full flex-wrap gap-6">
            <When condition={isPPC}>
              <GoalProgressCard label={t("Workday Count (PPC)")} value={site.workday_count} className="w-[170px]" />
            </When>
            <GoalProgressCard
              label={t("Hectares Restored Goal")}
              value={site.hectares_to_restore_goal}
              className="w-[170px]"
            />
            <GoalProgressCard
              label={t("Trees restored")}
              hasProgress={false}
              items={[
                { iconName: IconNames.TREE_CIRCLE, label: t("Trees Planted"), value: site.trees_planted_count },
                { iconName: IconNames.LEAF_CIRCLE, label: t("Seeds Planted"), value: site.seeds_planted_count },
                {
                  iconName: IconNames.REFRESH_CIRCLE,
                  label: t("Trees Regenerating"),
                  value: site.regenerated_trees_count
                }
              ]}
              className="flex-1"
            />
          </div>
        </PageCard>
        <PageCard title={t("Site Area")}>
          <Map className="rounded-lg" geojson={geoJSON} imageLayerGeojson={imagesGeoJson} />
        </PageCard>
      </PageRow>

      <PageRow>
        <PageColumn>
          <PageCard title={t("Site Information")} gap={8}>
            <SelectImageListField
              title={t("Target Land Use Types")}
              options={landUseTypesOptions}
              selectedValues={site.land_use_types}
            />
            <SelectImageListField
              title={t("Restoration Strategies")}
              options={restorationStrategyOptions}
              selectedValues={site.restoration_strategy}
            />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Site Details")} gap={4}>
            <TextField label={t("Site Name")} value={site?.name} />
            <When condition={isPPC}>
              <TextField label={t("Site type")} value={site?.control_site ? t("Control Site") : t("Site")} />
            </When>
            <TextField label={t("Planting start date")} value={format(site.start_date)} />
            <TextField label={t("Planting end date")} value={format(site.start_date)} />
            <TextField label={t("Last Updated")} value={format(site.updated_at)} />
          </PageCard>
          <Paper>
            <ButtonField
              label={t("Tree Monitoring")}
              subtitle={t(
                "Tree monitoring must be completed for each site at baseline, 2.5 years and 5 years. Tree monitoring data is used to calculate the number of trees, natural regeneration, and survival rate of planted trees."
              )}
              buttonProps={{
                as: Link,
                variant: "secondary",
                children: t("View"),
                href: "https://ee.kobotoolbox.org/x/NKctF6KV"
              }}
            />
          </Paper>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default SiteOverviewTab;
