import { useT } from "@transifex/react";
import Link from "next/link";
import { When } from "react-if";

import ButtonField from "@/components/elements/Field/ButtonField";
import LongTextField from "@/components/elements/Field/LongTextField";
import SelectImageListField from "@/components/elements/Field/SelectImageListField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import InvasiveTable from "@/components/extensive/Tables/InvasiveTable";
import SeedingsTable from "@/components/extensive/Tables/SeedingsTable";
import { useDate } from "@/hooks/useDate";
import { useFramework } from "@/hooks/useFramework";
import { useGetOptions } from "@/hooks/useGetOptions";

interface SiteDetailsTabProps {
  site: any;
}

const SiteDetailTab = ({ site }: SiteDetailsTabProps) => {
  const t = useT();
  const { format } = useDate();
  const { isPPC } = useFramework(site);

  const landUseTypesOptions = useGetOptions(site.land_use_types);
  const landTenuresOptions = useGetOptions(site.land_tenures);
  const restorationStrategyOptions = useGetOptions(site.restoration_strategy);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Site Information")}>
            <LongTextField title={t("Description")}>{site.description}</LongTextField>
            <LongTextField title={t("History")}>{site.history}</LongTextField>
            <LongTextField title={t("Planting Pattern")}>{site.planting_pattern}</LongTextField>
            <LongTextField title={t("Landscape Community Contribution")}>
              {site.landscape_community_contribution}
            </LongTextField>
            <SelectImageListField
              title={t("Restoration Strategy")}
              options={restorationStrategyOptions}
              selectedValues={site.restoration_strategy}
            />
            <SelectImageListField
              title={t("Land Tenure Type")}
              options={landTenuresOptions}
              selectedValues={site.land_tenures}
            />
            <SelectImageListField
              title={t("Land Use Type")}
              options={landUseTypesOptions}
              selectedValues={site.land_use_types}
            />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Site Creation")}>
            <TextField label={t("Site Created")} value={format(site.created_at)} />
          </PageCard>
          <When condition={isPPC}>
            <PageCard title={t("Direct seeding")}>
              <SeedingsTable modelName="site" modelUUID={site.uuid} type="weight" />
            </PageCard>
            <PageCard title={t("Invasives")}>
              <InvasiveTable modelName="site" modelUUID={site.uuid} collection="invasive" />
            </PageCard>
          </When>
          <When condition={isPPC}>
            <PageCard title={t("Additional Information")} gap={4}>
              <TextField label={t("Mature Trees Count")} value={site.aim_number_of_mature_trees} />
              <TextField label={t("Soil Condition")} value={site.soil_condition} />
            </PageCard>
            <Paper>
              <ButtonField
                label={t("Stratification for Heterogeneity")}
                buttonProps={{
                  as: Link,
                  variant: "secondary",
                  children: t("Download"),
                  download: true,
                  href: site.stratification_for_heterogeneity || ""
                }}
              />
            </Paper>
          </When>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default SiteDetailTab;
