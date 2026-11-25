import { useT } from "@transifex/react";
import { FC } from "react";

import NoResults from "@/redesignComponents/content/NoResults/NoResults";

type MyProjectsEmptyStateProps = {
  isOrgPending: boolean;
  isFiltered: boolean;
  hasActiveSearch: boolean;
};

const MyProjectsEmptyState: FC<MyProjectsEmptyStateProps> = ({ isOrgPending, isFiltered, hasActiveSearch }) => {
  const t = useT();

  if (isOrgPending) {
    return (
      <NoResults
        className="!px-0"
        title={t("Explore Funding Projects")}
        description={t(
          "Your organization's approval is currently pending, which is why you can't view any listed projects here. Once your organization receives approval, this page will showcase all available projects, enabling you to apply for them. In the meantime, if you have questions or require assistance, please don't hesitate to contact our support team through the help center."
        )}
      />
    );
  }

  if (!isFiltered) {
    return (
      <NoResults
        className="!px-0"
        title={t("Start monitoring your project")}
        description={t(
          "Your organization currently has no projects. To begin monitoring your restoration activities, you need to create a project in TerraMatch."
        )}
      />
    );
  }

  return (
    <NoResults
      className="!px-0"
      title={t("No projects found")}
      description={
        hasActiveSearch
          ? t("We couldn’t find any projects matching your search. Try a different keyword.")
          : t("We couldn’t find any projects matching your filters. Try adjusting or clearing your filters.")
      }
    />
  );
};

export default MyProjectsEmptyState;
