import { useT } from "@transifex/react";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import SectionBody from "@/components/elements/Section/SectionBody";
import SectionEntryRow from "@/components/elements/Section/SectionEntryRow";
import Table from "@/components/elements/Table/Table";
import Text from "@/components/elements/Text/Text";
import { useModalContext } from "@/context/modal.provider";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import PitchEditModal from "@/pages/project-pitches/components/PitchEditModal";
import TabContainer from "@/pages/project-pitches/components/tabs/TabContainer";

interface PitchSocialImpactTabProps {
  pitch: ProjectPitchRead;
}

const PitchSocialImpactTab = ({ pitch }: PitchSocialImpactTabProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  const onEdit = () => openModal(<PitchEditModal pitch={pitch} />);

  return (
    <TabContainer>
      <Button className="my-8" onClick={onEdit}>
        {t("Edit Pitch")}
      </Button>
      <Accordion title={t("Social Impact")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <SectionEntryRow title={t("Total expected new jobs")} isEmpty={!pitch.num_jobs_created}>
            <Text variant="text-heading-100">{pitch.num_jobs_created}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("New jobs breakdown")}>
            <Table
              columns={[
                { header: t("Breakdown of new paid jobs"), accessorKey: "name" },
                { header: t("Percentage%"), accessorKey: "value" }
              ]}
              data={[
                {
                  name: t("% of total employees that would be men"),
                  value: pitch.pct_employees_men || t("Not provided")
                },
                {
                  name: t("% of total employees that would be women"),
                  value: pitch.pct_employees_women || t("Not provided")
                },
                {
                  name: t("% of total employees that would be between the ages of 18 and 35?"),
                  value: pitch.pct_employees_18to35 || t("Not provided")
                },
                {
                  name: t("% of total employees that would be older than 35 years of age?"),
                  value: pitch.pct_employees_older35 || t("Not provided")
                }
              ]}
            />
          </SectionEntryRow>

          <SectionEntryRow title={t("Project beneficiaries Total")} isEmpty={!pitch.proj_beneficiaries}>
            <Text variant="text-heading-100">{pitch.proj_beneficiaries}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Project beneficiaries breakdown")}>
            <Table
              columns={[
                { header: t("Breakdown"), accessorKey: "name" },
                { header: t("Percentage%"), accessorKey: "value" }
              ]}
              data={[
                {
                  name: t("% of female beneficiaries"),
                  value: pitch.pct_beneficiaries_women || t("Not provided")
                },
                {
                  name: t("% of smallholder farmers beneficiaries"),
                  value: pitch.pct_beneficiaries_small || t("Not provided")
                },
                {
                  name: t("% of large-scale farmers beneficiaries"),
                  value: pitch.pct_beneficiaries_large || t("Not provided")
                },
                {
                  name: t("% of beneficiaries younger than 36"),
                  value: pitch.pct_beneficiaries_youth || t("Not provided")
                }
              ]}
            />
          </SectionEntryRow>

          <SectionEntryRow title={t("Socioeconomic impact of the project")} isEmpty={!pitch.proj_impact_socieconom}>
            <Text variant="text-heading-100">{pitch.proj_impact_socieconom}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion
        title={t("More Details on Social Impact of Project")}
        defaultOpen
        className="mb-15 w-full bg-white shadow"
      >
        <SectionBody>
          <SectionEntryRow
            title={t("Land degradation impact on the livelihoods of the communities living in the project area")}
            isEmpty={!pitch.curr_land_degradation}
          >
            <Text variant="text-heading-100">{pitch.curr_land_degradation}</Text>
          </SectionEntryRow>

          <SectionEntryRow
            title={t(
              "How would restoring the project area improve the livelihoods of local people and their communities?"
            )}
            isEmpty={!pitch.proj_impact_socieconom}
          >
            <Text variant="text-heading-100">{pitch.proj_impact_socieconom}</Text>
          </SectionEntryRow>

          <SectionEntryRow
            title={t("How would the project impact local food security?")}
            isEmpty={!pitch.proj_impact_foodsec}
          >
            <Text variant="text-heading-100">{pitch.proj_impact_foodsec}</Text>
          </SectionEntryRow>

          <SectionEntryRow
            title={t("How would the project impact local water security?")}
            isEmpty={!pitch.proj_impact_watersec}
          >
            <Text variant="text-heading-100">{pitch.proj_impact_watersec}</Text>
          </SectionEntryRow>

          <SectionEntryRow
            title={t("What kind of new jobs would this project create?")}
            isEmpty={!pitch.proj_impact_jobtypes}
          >
            <Text variant="text-heading-100">{pitch.proj_impact_jobtypes}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>
    </TabContainer>
  );
};

export default PitchSocialImpactTab;
