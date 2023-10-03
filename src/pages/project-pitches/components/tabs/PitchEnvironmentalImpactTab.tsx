import { useT } from "@transifex/react";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import SectionBody from "@/components/elements/Section/SectionBody";
import SectionEntryRow from "@/components/elements/Section/SectionEntryRow";
import SelectImageList from "@/components/elements/SelectImageList/SelectImageList";
import Table from "@/components/elements/Table/Table";
import Text from "@/components/elements/Text/Text";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { useModalContext } from "@/context/modal.provider";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import PitchEditModal from "@/pages/project-pitches/components/PitchEditModal";
import TabContainer from "@/pages/project-pitches/components/tabs/TabContainer";
import { notEmpty } from "@/utils/array";

interface PitchEnvironmentalImpactTabProps {
  pitch: ProjectPitchRead;
}

const PitchEnvironmentalImpactTab = ({ pitch }: PitchEnvironmentalImpactTabProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  const onEdit = () => openModal(<PitchEditModal pitch={pitch} />);

  return (
    <TabContainer>
      <Button className="my-8" onClick={onEdit}>
        {t("Edit Pitch")}
      </Button>
      <Accordion title={t("Environmental Impact")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <SectionEntryRow
            title={t("Proposed Restoration Intervention Methods")}
            isEmpty={!notEmpty(pitch.restoration_intervention_types)}
          >
            <SelectImageList
              options={getRestorationInterventionTypeOptions(t)}
              //@ts-ignore
              selectedValues={pitch.restoration_intervention_types || []}
            />
          </SectionEntryRow>

          <SectionEntryRow title={t("Proposed number of hectares to be restored")} isEmpty={!pitch.total_hectares}>
            <Text variant="text-heading-100">{pitch.total_hectares}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Proposed number of trees to be grown")} isEmpty={!pitch.total_trees}>
            <Text variant="text-heading-100">{pitch.total_trees}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Proposed Tree Species")} isEmpty={!notEmpty(pitch.tree_species)}>
            <Table
              columns={[
                { header: t("Tree Species"), accessorKey: "name" },
                { header: t("Total"), accessorKey: "amount" }
              ]}
              data={pitch.tree_species || []}
              initialTableState={{ pagination: { pageSize: 5 } }}
            />
          </SectionEntryRow>

          <SectionEntryRow title={t("Proposed number of sites")} isEmpty={!pitch.proposed_num_sites}>
            <Text variant="text-heading-100">{pitch.proposed_num_sites}</Text>
          </SectionEntryRow>

          <SectionEntryRow
            title={t("Proposed number of nurseries expanded or created")}
            isEmpty={!pitch.proposed_num_nurseries}
          >
            <Text variant="text-heading-100">{pitch.proposed_num_nurseries}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion
        title={t("Biophysical characteristics of the project area")}
        defaultOpen
        className="mb-15 w-full bg-white shadow"
      >
        <SectionBody>
          <SectionEntryRow
            title={t("Main causes of degradation in the project area")}
            //@ts-ignore
            isEmpty={!pitch.main_causes_of_degradation}
          >
            {/* @ts-ignore */}
            <Text variant="text-heading-100">{pitch.main_causes_of_degradation}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Ecological benefits of the project")} isEmpty={!pitch.environmental_goals}>
            <Text variant="text-heading-100">{pitch.environmental_goals}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion
        title={t("Sources of tree seedlings for the project")}
        defaultOpen
        className="mb-15 w-full bg-white shadow"
      >
        <SectionBody>
          <Text variant="text-heading-100">
            {
              // @ts-ignore
              pitch.seedlings_source || t("Not provided")
            }
          </Text>
        </SectionBody>
      </Accordion>
    </TabContainer>
  );
};

export default PitchEnvironmentalImpactTab;
