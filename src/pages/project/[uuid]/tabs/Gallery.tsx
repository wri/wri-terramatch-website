import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import ButtonField from "@/components/elements/Field/ButtonField";
import Paper from "@/components/elements/Paper/Paper";
import EntityMapAndGalleryCard, {
  EntityMapAndGalleryCardProps
} from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

type GalleryTabProps = EntityMapAndGalleryCardProps & {
  sharedDriveLink?: string;
};

const GalleryTab: FC<GalleryTabProps> = ({ sharedDriveLink, ...props }) => {
  const t = useT();
  return (
    <PageBody className="bg-theme-neutral-200 pt-5">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageColumn>
          <EntityMapAndGalleryCard {...props} />

          {props.modelName === "project-reports" && sharedDriveLink != null && (
            <Paper>
              <ButtonField
                label={t("Shared Drive link")}
                buttonProps={{
                  as: Link,
                  children: t("View"),
                  href: sharedDriveLink,
                  target: "_blank"
                }}
              />
            </Paper>
          )}
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GalleryTab;
