import { useT } from "@transifex/react";
import React, { FC } from "react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface GoalsAndProgressTabProps {
  nurseryReport: NurseryReportFullDto;
}

const GoalsAndProgressTab: FC<GoalsAndProgressTabProps> = ({ nurseryReport }) => {
  const t = useT();
  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard gap={8}>
            <Text variant="text-20-bold">{t("Seedlings Grown")}</Text>
            <GoalProgressCard
              hasProgress={false}
              classNameCard="!pl-0"
              items={[
                {
                  iconName: IconNames.LEAF_CIRCLE_PD,
                  label: t("TOTAL SEEDLINGS GROWN (on report):"),
                  variantLabel: "text-14",
                  classNameLabel: " text-neutral-650 uppercase !w-auto",
                  classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                  value: nurseryReport.seedlingsYoungTrees!
                }
              ]}
              className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              title={t("Seedlings Grown")}
            />
            <TreeSpeciesTable
              entity="nurseryReports"
              entityUuid={nurseryReport.uuid}
              collection="nursery-seedling"
              visibleRows={8}
              galleryType={"treeSpeciesPD"}
            />
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
