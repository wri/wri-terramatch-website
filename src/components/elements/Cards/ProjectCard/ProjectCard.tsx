import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren, useState } from "react";

import Button from "@/components/elements/Button/Button";
import ExpandedCard from "@/components/elements/Cards/ExpandedCard/ExpandedCard";
import Paper from "@/components/elements/Paper/Paper";
import StatusTag from "@/components/elements/StatusTag/StatusTag";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import NurseriesTable from "@/components/extensive/Tables/NurseriesTable";
import SitesTable from "@/components/extensive/Tables/SitesTable";
import { useReportingFramework } from "@/connections/ReportingFramework";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityCombinedStatus } from "@/helpers/entity";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";
import { getReportsIndexUrl } from "@/pages/reports/report-index/reportIndex.utils";

type ProjectCardProps = PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    project: ProjectLightDto;
  }
>;

const FrameworkName: FC<{ frameworkKey?: string | null }> = ({ frameworkKey }) => {
  const title = useFrameworkTitle();
  const [, { data: frameworkData }] = useReportingFramework({ frameworkKey: frameworkKey ?? undefined });

  return (
    <Text variant="text-light-subtitle-400" className="capitalize">
      {frameworkData?.name || title}
    </Text>
  );
};

const ProjectCard: FC<ProjectCardProps> = ({ project, title, children, className, ...rest }) => {
  const t = useT();
  const status = getEntityCombinedStatus(project);
  const isDraft = status === "draft";
  const [nurseriesCount, setNurseriesCount] = useState<number | undefined>();
  const [siteCount, setSiteCount] = useState<number | undefined>();

  return (
    <FrameworkProvider frameworkKey={project.frameworkKey}>
      <Paper {...rest} className={classNames(className, "p-0")}>
        <div className="flex items-center gap-4 border-b border-neutral-100 px-8 py-6 mobile:flex-col mobile:px-3">
          <div className="flex flex-1 flex-col gap-2">
            <Text variant="text-bold-headline-800">{project.name}</Text>
            {project.status != null && status != null && (
              <div className="flex items-center gap-2">
                <Text variant="text-bold-subtitle-500">{t("Status")}:</Text>
                <StatusTag status={status} variant="mapped" />
              </div>
            )}
            <div className="flex">
              <Text variant="text-bold-subtitle-500">{t("Framework")}:&#160;</Text>
              <FrameworkName frameworkKey={project.frameworkKey} />
            </div>
            <div className="flex">
              <Text variant="text-bold-subtitle-500">{t("Organisation")}:&#160;</Text>
              <Text variant="text-light-subtitle-400">{project.organisationName}</Text>
            </div>
          </div>
          <div className="flex gap-4 mobile:flex-col mobile:self-baseline">
            {isDraft ? (
              <>
                <Button as={Link} href={`/entity/projects/edit/${project.uuid}`}>
                  {t("Continue Project")}
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} variant="secondary" href={getReportsIndexUrl("project", project.uuid)}>
                  {t("View reporting tasks")}
                </Button>
                <Button as={Link} href={`/project/${project.uuid}`}>
                  {t("View Project")}
                </Button>
              </>
            )}
          </div>
        </div>
        {!isDraft && (
          <div className="space-y-6 p-8 mobile:px-3">
            <ExpandedCard
              headerChildren={
                <>
                  <Icon name={IconNames.SITE_CIRCLE} width={44} className="fill-success" />
                  <div className="flex flex-1 items-center">
                    <Text variant="text-bold-subtitle-500">
                      {`${t("Sites")} ${siteCount && siteCount > 0 ? `(${siteCount})` : ""}`}
                    </Text>
                    {siteCount === 0 && (
                      <Text variant="text-light-subtitle-400">
                        &nbsp;{t("- Your project doesn't have any sites. Add a new site by clicking 'Add Site'.")}
                      </Text>
                    )}
                  </div>
                  <Button
                    as={Link}
                    href={`/entity/sites/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.uuid}`}
                  >
                    {t("Add Site")}
                  </Button>
                </>
              }
            >
              <SitesTable
                project={project}
                hasAddButton={false}
                onFetch={data => setSiteCount(data?.indexTotal)}
                alwaysShowPagination
              />
            </ExpandedCard>

            <ExpandedCard
              frameworksHide={[Framework.PPC]}
              headerChildren={
                <>
                  <Icon name={IconNames.NURSERY_CIRCLE} width={44} className="fill-success" />
                  <div className="flex flex-1 items-center">
                    <Text variant="text-bold-subtitle-500">
                      {`${t("Nurseries")} ${nurseriesCount && nurseriesCount > 0 ? `(${nurseriesCount})` : ""}`}
                    </Text>
                    {nurseriesCount === 0 && (
                      <Text variant="text-light-subtitle-400">
                        &nbsp;
                        {t("- Your project doesn't have any nurseries. Add a new nursery by clicking 'Add Nursery'.")}
                      </Text>
                    )}
                  </div>
                  <Button
                    as={Link}
                    href={`/entity/nurseries/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.uuid}`}
                  >
                    {t("Add Nursery")}
                  </Button>
                </>
              }
            >
              <NurseriesTable
                project={project}
                hasAddButton={false}
                onFetch={data => setNurseriesCount(data?.indexTotal)}
                alwaysShowPagination
              />
            </ExpandedCard>
          </div>
        )}
      </Paper>
    </FrameworkProvider>
  );
};

export default ProjectCard;
