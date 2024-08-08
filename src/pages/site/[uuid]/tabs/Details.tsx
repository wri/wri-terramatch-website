import { useT } from "@transifex/react";
import Link from "next/link";

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
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { useDate } from "@/hooks/useDate";
import { useGetOptions } from "@/hooks/useGetOptions";

interface SiteDetailsTabProps {
  site: any;
}

const SiteDetailTab = ({ site }: SiteDetailsTabProps) => {
  const t = useT();
  const { format } = useDate();

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
              title={t("Land Use Type")}
              options={landUseTypesOptions}
              selectedValues={site.land_use_types}
            />
            <LongTextField
              frameworksShow={[Framework.HBF]}
              className="capitalize"
              title={t("Detailed Intervention Types")}
            >
              {site.detailed_intervention_types?.join(", ").replace(/-/g, " ")}
            </LongTextField>
            <SelectImageListField
              title={t("Land Tenure Type")}
              options={landTenuresOptions}
              selectedValues={site.land_tenures}
            />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Site Details")}>
            <TextField label={t("Site Name")} value={site.name} />
            <TextField label={t("Restoration Start Date")} value={format(site.start_date)} />
            <TextField label={t("Restoration End Date")} value={format(site.end_date)} />
          </PageCard>
          <PageCard title={t("Site Creation")}>
            <TextField label={t("Site Created")} value={format(site.created_at)} />
          </PageCard>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <PageCard title={t("Direct seeding")}>
              <SeedingsTable modelName="site" modelUUID={site.uuid} type="weight" />
            </PageCard>
            <PageCard title={t("Invasives")}>
              <InvasiveTable modelName="site" modelUUID={site.uuid} collection="invasive" />
            </PageCard>
          </ContextCondition>
          <PageCard title={t("Additional Information")} gap={4}>
            <TextField frameworksShow={[Framework.HBF]} label={t("Soil Condition")} value={site.soil_condition} />
            <ContextCondition frameworksHide={[Framework.PPC]}>
              <TextField label={t("Siting Strategy")} value={site.siting_strategy} />
              <TextField label={t("Siting Strategy Description")} value={site.description_siting_strategy} />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <TextField label={t("Planting Pattern")} value={site.planting_pattern} />
              <TextField label={t("Mature trees Count")} value={site.aim_number_of_mature_trees} />
            </ContextCondition>
          </PageCard>
          <ContextCondition frameworksShow={[Framework.PPC]}>
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
            <PageCard title={t("Tree Monitoring ")} gap={4}>
              <ButtonField
                label={t(
                  "Tree monitoring must be completed for each site at baseline, 2.5 years and 5 years. Tree monitoring data is used to calculate the number of trees, natural regeneration, and survival rate of planted trees."
                )}
                buttonProps={{
                  as: Link,
                  variant: "secondary",
                  children: t("Link"),
                  download: false,
                  href: "https://ee.kobotoolbox.org/x/NKctF6KV"
                }}
              />
            </PageCard>
          </ContextCondition>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default SiteDetailTab;
