import { twMerge } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";

import { Site } from "./types";

const GridsTitleReport = ({ title, className }: { title: string | React.ReactNode; className?: string }) => {
  return (
    <Text variant="text-10-semibold" className={twMerge("px-2 py-2 leading-[normal] text-black", className)}>
      {title}
    </Text>
  );
};

const GridsContentReport = ({ content }: { content: string | number | React.ReactNode | undefined }) => {
  return (
    <Text variant="text-10-light" className="px-2 py-2 leading-[normal] text-black">
      {content}
    </Text>
  );
};

const GrdTitleEmployment = () => {
  return (
    <>
      <GridsTitleReport title="" className="col-span-3" />
      <GridsTitleReport title="Total" />
      <GridsTitleReport title="Male" />
      <GridsTitleReport title="Female" />
      <GridsTitleReport title="Youth" />
      <GridsTitleReport title="Non-Youth" />
    </>
  );
};

const GrdTitleSites = () => {
  return (
    <>
      <GridsTitleReport title="Site Name" />
      <GridsTitleReport title="Site Hectare Goal" />
      <GridsTitleReport title="Hectares Under Restoration" />
      <GridsTitleReport title="Total Reported Disturbances" />
      <GridsTitleReport title="Climatic Disturbances" />
      <GridsTitleReport title="Manmade Disturbances" />
    </>
  );
};

const GrdTitleTreeSpecies = ({ sites }: { sites: Site[] }) => {
  return (
    <>
      <GridsTitleReport title="Species Name" />
      <GridsTitleReport title="Total Trees" />
      {sites.map(site => (
        <GridsTitleReport key={site.uuid} title={site.name} />
      ))}
      <GridsTitleReport title="Progress Towards Goal" />
    </>
  );
};

export { GridsTitleReport, GridsContentReport, GrdTitleEmployment, GrdTitleSites, GrdTitleTreeSpecies };
