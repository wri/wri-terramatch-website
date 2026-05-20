import { useRouter } from "next/router";

import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import EditEntityForm from "@/pages/entity/[entityName]/edit/[uuid]/EditEntityForm";
import ProjectResponsiveTypography from "@/styles/ResponsiveTypography";
import { EntityName } from "@/types/common";

/**
 * Use this page to edit the following entities for a given entity_name and entity_uuid
 * entity_name = projects/sites/nurseries/project-reports/site-reports/nursery-reports
 */
const EditEntityPage = () => {
  const router = useRouter();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;

  return (
    <BackgroundLayout>
      <ProjectResponsiveTypography />
      <EditEntityForm {...{ entityName, entityUUID }} />
    </BackgroundLayout>
  );
};

export default EditEntityPage;
