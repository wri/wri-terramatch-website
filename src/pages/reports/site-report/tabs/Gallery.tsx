import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import ButtonField from "@/components/elements/Field/ButtonField";
import Paper from "@/components/elements/Paper/Paper";
import EntityMapAndGalleryCard from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

type GalleryTabProps = {
  report: SiteReportFullDto;
  site?: SiteFullDto | null;
};

const GalleryTab: FC<GalleryTabProps> = ({ report, site }) => {
  const t = useT();

  return (
    <PageBody className="bg-theme-neutral-200 pt-5">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageColumn>
          <EntityMapAndGalleryCard
            modelName="sites"
            modelUUID={report.siteUuid!}
            modelTitle={t("Site Report")}
            entityData={site}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this site report."
            )}
          />
          {report.sharedDriveLink != null ? (
            <Paper>
              <ButtonField
                label={t("Shared Drive link")}
                buttonProps={{
                  as: Link,
                  children: t("View"),
                  href: report.sharedDriveLink ?? "",
                  target: "_blank"
                }}
              />
            </Paper>
          ) : null}
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GalleryTab;
