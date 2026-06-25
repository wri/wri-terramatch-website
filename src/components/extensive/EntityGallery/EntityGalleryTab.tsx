import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import ButtonField from "@/components/elements/Field/ButtonField";
import Paper from "@/components/elements/Paper/Paper";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import EntityGalleryCard, { EntityGalleryAssetDownload, EntityGalleryCardProps } from "./EntityGalleryCard";

export type { EntityGalleryAssetDownload };

export type EntityGalleryTabProps = EntityGalleryCardProps & {
  sharedDriveLink?: string;
  pageBodyClassName?: string;
  pageRowClassName?: string;
};

const EntityGalleryTab: FC<EntityGalleryTabProps> = ({
  sharedDriveLink,
  pageBodyClassName = "bg-theme-neutral-200 pt-5",
  pageRowClassName = "mx-0 w-full !max-w-full px-6",
  ...props
}) => {
  const t = useT();

  return (
    <PageBody className={pageBodyClassName}>
      <PageRow className={pageRowClassName}>
        <PageColumn>
          <EntityGalleryCard {...props} />

          {sharedDriveLink != null && (
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

export default EntityGalleryTab;
