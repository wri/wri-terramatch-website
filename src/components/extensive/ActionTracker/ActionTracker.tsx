import { useT } from "@transifex/react";
import Link from "next/link";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2MyApplications } from "@/generated/apiComponents";
import { ApplicationLiteRead } from "@/generated/apiSchemas";

import { IconNames } from "../Icon/Icon";
import ActionTrackerCard from "./ActionTrackerCard";
import ApplicationsCard from "./cards/ApplicationsCard";

const ActionTracker = () => {
  const t = useT();

  // Queries
  const { data: myApplications, isLoading } = useGetV2MyApplications<{ data: ApplicationLiteRead[] }>({
    queryParams: {
      page: 1,
      per_page: 1000
    }
  });

  return (
    <LoadingContainer loading={isLoading}>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        <ApplicationsCard applications={myApplications?.data} />
        {/* TODO: Todo replace with its own component - copy from ApplicationCard */}
        <ActionTrackerCard
          data={[]}
          title={t("Project Set Up")}
          icon={IconNames.LAPTOP_CIRCLE}
          emptyState={{
            title: t("Monitored projects"),
            subtitle: t(
              'This is the future home for project updates for PPC and TerraFund. While we are working to improve the site, you can view your monitored projects by selecting "My Projects" above'
            ),
            buttonProps: {
              as: Link,
              href: "/v1/monitoring",
              children: t("View my Projects")
            }
          }}
        />
        {/* TODO: Tobe replace with its own component - copy from ApplicationCard */}
        <ActionTrackerCard
          data={[]}
          title={t("Reporting")}
          icon={IconNames.ARROW_SPIN_CIRCLE}
          emptyState={{
            title: t("Reporting tasks"),
            subtitle: t(
              'This is the future home for reporting reminders for PPC and TerraFund.  While we are working to improve the site, you can view your due reports by selecting "My Projects" above'
            ),
            buttonProps: {
              as: Link,
              href: "/v1/monitoring",
              children: t("View my Reports")
            }
          }}
        />
      </div>
    </LoadingContainer>
  );
};

export default ActionTracker;
