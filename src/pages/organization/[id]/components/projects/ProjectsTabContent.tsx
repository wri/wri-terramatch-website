import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import Container from "@/components/generic/Layout/Container";

import ProjectsTabEmptyState from "./ProjectsTabEmptyState";

const ProjectsTabContent = () => {
  const t = useT();
  return (
    <Container className="py-15">
      <Text variant="text-heading-2000">{t("Projects")}</Text>
      <div className="mt-12 bg-neutral-150 px-14 py-8">
        <ProjectsTabEmptyState />
      </div>
    </Container>
  );
};

export default ProjectsTabContent;
