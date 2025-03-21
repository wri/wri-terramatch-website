import { useT } from "@transifex/react";

import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { useDate } from "@/hooks/useDate";

interface NurseryOverviewTabProps {
  nursery: any;
}

const NurseryOverviewTab = ({ nursery }: NurseryOverviewTabProps) => {
  const t = useT();
  const { format } = useDate();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Nursery Information")} gap={8}>
            <LongTextField title={t("Planting Contribution")}>{nursery?.plantingContribution}</LongTextField>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Nursery Details")} gap={4}>
            <TextField label={t("Nursery name")} value={nursery?.name} />
            <TextField label={t("Nursery type")} value={nursery?.nurseryType} />
            <TextField label={t("Nursery start date")} value={format(nursery?.startDate)} />
            <TextField label={t("Nursery end date")} value={format(nursery?.endDate)} />
            <TextField label={t("Last updated")} value={format(nursery?.updatedAt)} />
            <TextField label={t("Seedlings or Young Trees to be Grown")} value={nursery?.seedlingGrown} />
          </PageCard>
          <PageCard title={"Tree Species"}>
            <TreeSpeciesTable entityUuid={nursery?.uuid} entity="nurseries" collection="nursery-seedling" />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default NurseryOverviewTab;
