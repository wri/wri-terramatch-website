import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import EntityStatusModal, { StatusProps } from "@/components/extensive/EntityStatusModal";
import { IconNames } from "@/components/extensive/Icon/Icon";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { INFORMATION_REQUIRED, PENDING_APPROVAL } from "@/constants/statuses";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import TagSubmission, { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import ChevronRightIcon from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

interface NurseryOverviewTabProps {
  nursery: NurseryFullDto;
}

const NurseryOverviewTab = ({ nursery }: NurseryOverviewTabProps) => {
  const router = useRouter();
  const t = useT();
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery.uuid,
    entityStatus: nursery.status ?? "draft",
    updateRequestStatus: nursery.updateRequestStatus
  });

  const needMoreInformation =
    nursery.updateRequestStatus === INFORMATION_REQUIRED || nursery.status === INFORMATION_REQUIRED;
  const awaitingApproval = nursery.updateRequestStatus === PENDING_APPROVAL || nursery.status === PENDING_APPROVAL;
  const hasUpdateRequest =
    !["draft", "approved"].includes(nursery.updateRequestStatus ?? "") && nursery.updateRequestStatus != null;

  const statusProps: StatusProps | undefined = useMemo(() => {
    if (!needMoreInformation) return undefined;
    const titlePrefix = hasUpdateRequest ? "Change Request Status:" : "Status:";
    return {
      title: t(`${titlePrefix} Information Required`),
      icon: IconNames.EXCLAMATION_CIRCLE_FILL,
      className: "fill-tertiary"
    };
  }, [needMoreInformation, hasUpdateRequest, t]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval && statusProps != null) {
      setOpenStatusModal(true);
    } else {
      handleEdit();
    }
  }, [needMoreInformation, statusProps, handleEdit, awaitingApproval]);

  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };

  return (
    <PageContent>
      {EditModals}
      {statusProps != null && (
        <EntityStatusModal
          statusProps={statusProps}
          feedback={nursery.feedback}
          needMoreInformation={needMoreInformation}
          entityName="nurseries"
          entityUuid={nursery.uuid}
          open={openStatusModal}
          onOpenChange={setOpenStatusModal}
        />
      )}
      <Flex gap={7} className="flex-col sm:flex-row">
        <PageItem
          title={t("Key Indicators")}
          flexProps={{ maxWidth: "26%" }}
          className="max-h-fit !w-full !max-w-full sm:!w-[26%] sm:!max-w-[26%]"
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("View Progress & Goals"),
            rightIcon: <ChevronRightIcon />,
            onClick: () => goToTab("progress-and-goals")
          }}
        >
          <MetricCard
            title={t("Seedlings Grown")}
            variant="donutChart"
            progress={nursery?.treesSeedlingsGrownCount ?? 0}
            goal={nursery?.seedlingGrown ?? 0}
            icon={<SeedlingsIcon boxSize={6} />}
            tooltipContent={t("Number of seedlings grown for this project.")}
            color="secondary.500"
          />
        </PageItem>
        <AboutPageItem
          type="nursery"
          flexProps={{ maxWidth: "37%" }}
          className="!w-full !max-w-full sm:!w-[37%] sm:!max-w-[37%]"
        />
        <PageItem
          flexProps={{ maxWidth: "37%", overflow: "hidden" }}
          className="!w-full !max-w-full sm:!w-[37%] sm:!max-w-[37%]"
          title={t("Nursery Set Up")}
          tag={(() => {
            const tagState = mapStatusToTagStateEntity(
              nursery?.updateRequestStatus == "pending-approval" ? nursery?.updateRequestStatus : nursery?.status
            );
            return nursery.updateRequestStatus === "pending-approval" ? (
              <TagSubmission state="pending-approval" />
            ) : nursery?.status != null ? (
              <TagSubmission state={tagState?.type as TagSubmissionState} />
            ) : null;
          })()}
          buttonProps={{
            variant: "primary",
            size: "small",
            children: nursery?.status === "approved" ? t("Edit") : t("Continue"),
            rightIcon: <ChevronRightIcon />,
            onClick: handleEditClick
          }}
        >
          <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
            <EntitySetUpSection entity={nursery} type="nurseries" />
          </Box>
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default NurseryOverviewTab;
