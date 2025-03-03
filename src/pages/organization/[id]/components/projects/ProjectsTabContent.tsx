import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Container from "@/components/generic/Layout/Container";
import { useProjectIndex } from "@/connections/Entity";
import { getCountriesOptions } from "@/constants/options/countries";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formatOptionsList } from "@/utils/options";

const ProjectsTabContent = () => {
  const t = useT();
  const [, { entities: projects }] = useProjectIndex();

  return (
    <Container className="px-8 py-15">
      <If condition={(projects?.length ?? 0) > 0}>
        <Then>
          <div className="mb-8 flex">
            <Text variant="text-heading-1000" className="flex-1">
              {t("Projects")}
            </Text>
            <Button as={Link} href="/project/reporting-framework-select">
              {t("Add new Project")}
            </Button>
          </div>
          <div className="rounded-xl p-8 shadow">
            <Table<ProjectLightDto>
              variant={VARIANT_TABLE_BORDER_ALL}
              columns={[
                { header: t("Title"), accessorKey: "name" },
                {
                  header: t("Location"),
                  accessorKey: "country",
                  cell: props => `${formatOptionsList(getCountriesOptions(t), props.getValue() as string)}`
                },
                {
                  accessorKey: "status",
                  header: t("Status"),
                  cell: (props: any) => {
                    const statusProps = getActionCardStatusMapper(t)[props.getValue() as any];
                    if (!statusProps) return null;

                    return (
                      <StatusPill status={statusProps.status!} className="w-fit">
                        <Text variant="text-bold-caption-100">{statusProps.statusText}</Text>
                      </StatusPill>
                    );
                  }
                },
                {
                  header: "",
                  enableSorting: false,
                  accessorKey: "uuid",
                  cell: props => (
                    <If condition={props.row.original?.status === "started"}>
                      <Then>
                        <Button as={Link} href={`/entity/projects/edit/${props.getValue()}`} className="float-right">
                          {t("Continue")}
                        </Button>
                      </Then>
                      <Else>
                        <Button as={Link} href={`/project/${props.getValue()}`} className="float-right">
                          {t("View")}
                        </Button>
                      </Else>
                    </If>
                  )
                }
              ]}
              data={projects ?? []}
              initialTableState={{ pagination: { pageSize: 5 } }}
            />
          </div>
        </Then>
        <Else>
          <EmptyState
            title={t("Create a project")}
            subtitle={t("Your organization currently does not have any available projects.")}
            iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
            ctaProps={{
              as: Link,
              href: "/project/reporting-framework-select",
              children: t("Create Project")
            }}
          />
        </Else>
      </If>
    </Container>
  );
};

export default ProjectsTabContent;
