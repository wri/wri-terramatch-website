import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

const ProjectsTabEmptyState = () => {
  const t = useT();
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow">
      <div className="flex flex-col gap-2">
        <Text variant="text-heading-200">{t("Monitor Project Progress")}</Text>
        <Text variant="text-body-600">{t("Create a project to monitor restoration progress.")}</Text>
      </div>

      <Button
        as={Link}
        href="/project/reporting-framework-select"
        // @ts-ignore
        locale="en-US"
      >
        {t("Create Project")}
      </Button>
    </div>
  );
};

export default ProjectsTabEmptyState;
