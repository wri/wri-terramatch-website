import { useT } from "@transifex/react";
import React from "react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { usePlantSpeciesCount, usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface GoalsAndProgressTabProps {
  nursery: NurseryFullDto;
}

const GoalsAndProgressTab = ({ nursery }: GoalsAndProgressTabProps) => {
  const t = useT();
  const totalCountNurserySeedling = usePlantTotalCount({
    entity: "nurseries",
    entityUuid: nursery?.uuid,
    collection: "nursery-seedling"
  });

  const { speciesCount: nurserySeedlingSpeciesCount } = usePlantSpeciesCount({
    entity: "nurseries",
    entityUuid: nursery?.uuid,
    collection: "nursery-seedling"
  });

  return (
    <PageBody className="bg-theme-neutral-200 !space-y-10 pt-5 text-darkCustom">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard title={t("Seedling Growth Progress")}>
          <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
            <div className="flex flex-col gap-4">
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.LEAF_CIRCLE_PD,
                    label: t("Number of Seedlings Growing:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: totalCountNurserySeedling
                  },
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species GROWING:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: nurserySeedlingSpeciesCount
                  }
                ]}
              />
            </div>
            <TreeSpeciesTable
              entity="nurseries"
              entityUuid={nursery.uuid}
              collection="nursery-seedling"
              visibleRows={8}
              galleryType="treeSpeciesPD"
            />
          </div>
        </PageCard>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
