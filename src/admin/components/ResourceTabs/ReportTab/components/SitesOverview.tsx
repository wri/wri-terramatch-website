import { FC, Fragment } from "react";

import { GrdTitleSites } from "../GridsReportContent";
import { GridsContentReport } from "../GridsReportContent";
import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import { Site } from "../types";

interface SitesOverviewProps {
  sites: Site[];
}

const SitesOverview: FC<SitesOverviewProps> = ({ sites }) => {
  return (
    <div className="section-container col-span-2 h-full">
      <HeaderSecReportGemeration title="Sites" />
      <div className="grid grid-cols-6 divide-y divide-black/10 border-b border-black/10">
        <GrdTitleSites />
        {sites.map((site, index) => (
          <Fragment key={index}>
            <GridsContentReport content={site?.name} />
            <GridsContentReport content={site?.hectaresToRestoreGoal?.toLocaleString()} />
            <GridsContentReport
              content={site?.totalHectaresRestoredSum?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            />
            <GridsContentReport content={site?.totalReportedDisturbances} />
            <GridsContentReport content={site?.manmadeDisturbances} />
            <GridsContentReport content={site?.climaticDisturbances} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default SitesOverview;
