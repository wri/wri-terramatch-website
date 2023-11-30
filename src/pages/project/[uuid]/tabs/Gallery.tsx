import { useT } from "@transifex/react";
import Link from "next/link";
import { When } from "react-if";

import ButtonField from "@/components/elements/Field/ButtonField";
import Paper from "@/components/elements/Paper/Paper";
import EntityMapAndGalleryCard, {
  EntityMapAndGalleryCardProps
} from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

const GalleryTab = (props: EntityMapAndGalleryCardProps & { sharedDriveLink?: string }) => {
  const t = useT();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <EntityMapAndGalleryCard {...props} />

          <When condition={props.modelName === "project-reports" && !!props.sharedDriveLink}>
            <Paper>
              <ButtonField
                label={t("Shared Drive link")}
                buttonProps={{
                  as: Link,
                  children: t("View"),
                  href: props.sharedDriveLink,
                  target: "_blank"
                }}
              />
            </Paper>
          </When>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default GalleryTab;
