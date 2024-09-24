import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import ExpandedCard from "@/components/elements/Cards/ExpandedCard/ExpandedCard";
import IconButton from "@/components/elements/IconButton/IconButton";
import Paper from "@/components/elements/Paper/Paper";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import NurseriesTable from "@/components/extensive/Tables/NurseriesTable";
import SitesTable from "@/components/extensive/Tables/SitesTable";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { getEntityCombinedStatus } from "@/helpers/entity";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

export interface ProjectCardProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  project: any;
  onDelete: (uuid: string) => void;
}

const FrameworkName = () => {
  const title = useFrameworkTitle();
  return (
    <Text variant="text-light-subtitle-400" className="capitalize">
      {title}
    </Text>
  );
};

const ProjectCard = ({ project, onDelete, title, children, className, ref, ...rest }: ProjectCardProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const status = getEntityCombinedStatus(project);
  const statusProps = project.status ? getActionCardStatusMapper(t)[status] : undefined;
  const [siteCount, setSiteCount] = useState();
  const [nurseriesCount, setNurseriesCount] = useState();

  const onDeleteProject = () => {
    openModal(
      ModalId.CONFIRM_PROJECT_DRAFT_DELETION,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Project Draft Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this project draft? "
        )}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: () => {
            onDelete(project.uuid);
            closeModal(ModalId.CONFIRM_PROJECT_DRAFT_DELETION);
          }
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.CONFIRM_PROJECT_DRAFT_DELETION)
        }}
      />
    );
  };

  return (
    <FrameworkProvider frameworkKey={project.framework_key}>
      <Paper {...rest} className={classNames(className, "p-0")}>
        <div className="flex items-center gap-4 border-b border-neutral-100 px-8 py-6">
          <div className="flex flex-1 flex-col gap-2">
            <Text variant="text-bold-headline-800">{project.name}</Text>
            {statusProps && (
              <div className="flex">
                <Text variant="text-bold-subtitle-500">{t("Status")}:&#160;</Text>
                <StatusPill status={statusProps.status!} className="w-fit-content">
                  <Text variant="text-bold-caption-100">{statusProps.statusText}</Text>
                </StatusPill>
              </div>
            )}
            <div className="flex">
              <Text variant="text-bold-subtitle-500">{t("Framework")}:&#160;</Text>
              <FrameworkName />
            </div>
            <div className="flex">
              <Text variant="text-bold-subtitle-500">{t("Organisation")}:&#160;</Text>
              <Text variant="text-light-subtitle-400">{project.organisation?.name}</Text>
            </div>
          </div>
          <div className="flex gap-4">
            <If condition={statusProps?.status === "edit"}>
              <Then>
                <Button as={Link} href={`/entity/projects/edit/${project.uuid}`}>
                  {t("Continue Project")}
                </Button>
                <IconButton
                  iconProps={{ name: IconNames.TRASH_CIRCLE, className: "fill-error", width: 32 }}
                  onClick={() => onDeleteProject()}
                />
              </Then>
              <Else>
                <Button as={Link} variant="secondary" href={`/project/${project.uuid}?tab=reporting-tasks`}>
                  {t("View reporting tasks")}
                </Button>
                <Button as={Link} href={`/project/${project.uuid}`}>
                  {t("View Project")}
                </Button>
              </Else>
            </If>
          </div>
        </div>
        <When condition={statusProps?.status !== "edit"}>
          <div className="space-y-6 p-8">
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
                    href={`/entity/sites/create/${project.framework_uuid}?parent_name=projects&parent_uuid=${project.uuid}`}
                  >
                    {t("Add Site")}
                  </Button>
                </>
              }
            >
              {(typeof siteCount === "undefined" || siteCount > 0) && (
                <SitesTable
                  project={project}
                  hasAddButton={false}
                  onFetch={data =>
                    //@ts-expect-error
                    typeof data.meta?.unfiltered_total === "number" && setSiteCount(data.meta?.unfiltered_total)
                  }
                />
              )}
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
                    href={`/entity/nurseries/create/${project.framework_uuid}?parent_name=projects&parent_uuid=${project.uuid}`}
                  >
                    {t("Add Nursery")}
                  </Button>
                </>
              }
            >
              {(typeof nurseriesCount === "undefined" || nurseriesCount > 0) && (
                <NurseriesTable
                  project={project}
                  hasAddButton={false}
                  onFetch={data =>
                    //@ts-expect-error
                    typeof data.meta?.unfiltered_total === "number" && setNurseriesCount(data.meta?.unfiltered_total)
                  }
                />
              )}
            </ExpandedCard>
          </div>
        </When>
      </Paper>
    </FrameworkProvider>
  );
};

export default ProjectCard;
