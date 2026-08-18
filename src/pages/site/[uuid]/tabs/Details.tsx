import { useRouter } from "next/router";
import { FC } from "react";

import SiteDataTable from "@/components/entityData/SiteDataTable";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

interface SiteDetailsTabProps {
  site: SiteFullDto;
}

const SiteDetailTab: FC<SiteDetailsTabProps> = ({ site }) => {
  const router = useRouter();

  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      {/* The single polygon home. Geometry editing, upload, and validation review live in the heavier
          workspace, opened from here rather than shown as a second, redundant polygon tab. The
          editable detail form now lives on the Overview tab. */}
      <PageItem
        title="Site Polygons"
        flexProps={{ width: "100%" }}
        buttonProps={{
          variant: "secondary",
          size: "small",
          children: "Open polygon editor",
          rightIcon: <ChevronRightIcon />,
          onClick: () => router.push(`/site/${site.uuid}?tab=polygons`)
        }}
      >
        <SiteDataTable siteUuid={site.uuid} projectUuid={site.projectUuid ?? ""} />
      </PageItem>
    </PageContent>
  );
};

export default SiteDetailTab;
