import React from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface GoalsAndProgressTabProps {
  nursery: NurseryFullDto;
}

const GoalsAndProgressTab = ({ nursery }: GoalsAndProgressTabProps) => {
  const totalNurserySeedlings = usePlantTotalCount({
    entity: "nurseries",
    entityUuid: nursery?.uuid,
    collection: "nursery-seedling"
  });

  return (
    <PageBody>
      <PageRow>
        <PageCard
          title={"Saplings to be Grown"}
          headerChildren={
            <div className="flex items-center gap-2">
              <span className="text-18 font-semibold text-primary">
                {totalNurserySeedlings.toLocaleString?.() ?? 0}
              </span>
            </div>
          }
        >
          <TreeSpeciesTable entityUuid={nursery?.uuid} entity="nurseries" collection="nursery-seedling" />
        </PageCard>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
