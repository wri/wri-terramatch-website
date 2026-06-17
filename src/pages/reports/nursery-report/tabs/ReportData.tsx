import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ButtonField from "@/components/elements/Field/ButtonField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import EntityMapAndGalleryCard from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { NurseryFullDto, NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";

type NurseryReportDataTabProps = {
  report: NurseryReportFullDto;
  nursery?: NurseryFullDto | null;
};

const NurseryReportDataTab: FC<NurseryReportDataTabProps> = ({ report, nursery }) => {
  const t = useT();
  const { format } = useDate();

  if (report.nothingToReport) {
    return (
      <PageRow>
        <PageColumn>
          <NothingToReportEmptyState />
        </PageColumn>
      </PageRow>
    );
  }

  return (
    <>
      <PageRow>
        <PageColumn>
          <EntityMapAndGalleryCard
            modelName="nurseryReports"
            modelUUID={report.uuid}
            entityData={nursery}
            modelTitle={t("Nursery Report")}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this nursery report."
            )}
          />
          {report.sharedDriveLink != null ? (
            <Paper>
              <ButtonField
                label={t("Shared Drive link")}
                buttonProps={{
                  as: Link,
                  children: t("View"),
                  href: report.sharedDriveLink ?? "",
                  target: "_blank"
                }}
              />
            </Paper>
          ) : null}
        </PageColumn>
      </PageRow>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Reported Data")} gap={4}>
            <LongTextField title={t("Interesting Facts")}>{report.interestingFacts}</LongTextField>
            <LongTextField title={t("Site Preparation")}>{report.sitePrep}</LongTextField>
          </PageCard>
        </PageColumn>
        <PageColumn>
          <PageCard title={t("Nursery Report Details")}>
            <TextField label={t("Nursery Report name")} value={report.title!} />
            <TextField label={t("Nursery name")} value={nursery?.name!} />
            <TextField
              label={t("Created by")}
              value={(report.createdByFirstName ?? "") + " " + (report.createdByLastName ?? "")}
            />
            <TextField label={t("Updated")} value={format(report.updatedAt)} />
            <TextField label={t("Due date")} value={format(report.dueAt)} />
            <TextField label={t("Submitted date")} value={format(report.submittedAt)} />
          </PageCard>
          <PageCard title={t("Overview")}>
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
                  value: report.seedlingsYoungTrees!
                }
              ]}
              className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              title={t("Seedlings Grown")}
            />
            <TreeSpeciesTable
              entity="nurseryReports"
              entityUuid={report.uuid}
              collection="nursery-seedling"
              visibleRows={8}
              galleryType={"treeSpeciesPD"}
            />
          </PageCard>
          <Paper>
            {report.treeSeedlingContributions?.[0]?.url != null ? (
              <ButtonField
                label={t("Tree Seedling Contributions")}
                subtitle={t(report.treeSeedlingContributions?.[0]?.fileName ?? "")}
                buttonProps={{
                  as: Link,
                  children: t("Download"),
                  href: report.treeSeedlingContributions?.[0]?.url ?? "",
                  download: true
                }}
              />
            ) : (
              <TextField label={t("Tree Seedling Contributions")} value={t("No file uploaded")} />
            )}
          </Paper>
        </PageColumn>
      </PageRow>
    </>
  );
};

export default NurseryReportDataTab;
