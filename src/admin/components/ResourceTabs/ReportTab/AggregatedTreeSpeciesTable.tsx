import { LinearProgress } from "@mui/material";
import { chunk, orderBy } from "lodash";
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import Text from "@/components/elements/Text/Text";
import { useTableData } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { GrdTitleTreeSpecies, GridsContentReport, GridsTitleReport } from "./GridsReportContent";
import HeaderSecReportGemeration from "./HeaderSecReportGemeration";
import { Site } from "./types";
interface TreeSpecies {
  name: string;
  speciesTypes: string[];
  totalCount: number;
  siteCounts: Record<string, number>;
  goalCount?: number;
}

interface TreeSpeciesTableRowData {
  name: [string, string[]];
  uuid: string;
  treeCount: number;
  goalCount?: number;
  treeCountGoal?: [number, number];
}

const SingleSiteDataComponent: FC<{
  site: Site;
  onDataLoaded: (data: TreeSpeciesTableRowData[] | undefined, siteUuid: string) => void;
}> = ({ site, onDataLoaded }) => {
  const siteData = useTableData({
    entity: "sites",
    entityUuid: site.uuid,
    collection: "tree-planted",
    tableType: "noGoal",
    plants: []
  });

  const processedRef = useRef(false);

  useEffect(() => {
    if (siteData !== undefined && !processedRef.current) {
      const normalizedData = siteData.map(row => ({
        ...row,
        treeCount: typeof row.treeCount === "string" ? parseInt(row.treeCount) : row.treeCount || 0
      }));
      processedRef.current = true;

      onDataLoaded(normalizedData, site.uuid);
    }
  }, [siteData, site.uuid, onDataLoaded, site.name]);

  return null;
};

const ProgressBar: FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const progressValue = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="flex items-center gap-2">
      <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 1, width: "50%" }} />
      <Text variant="text-10-light" className="mt-0.5">
        <span className="text-10-bold">{current.toLocaleString()}</span> of {goal.toLocaleString()}
      </Text>
    </div>
  );
};

const TreeSpeciesTableGroup: FC<{
  sites: Site[];
  aggregatedSpecies: TreeSpecies[];
  siteTotals: Record<string, number>;
  grandTotal: number;
  siteDataMap: Record<string, TreeSpeciesTableRowData[]>;
}> = ({ sites, aggregatedSpecies, siteTotals, grandTotal, siteDataMap }) => {
  return (
    <>
      <div className=" space-table print-page-break" />
      <Text variant="text-12" className="mb-2 text-black">
        Showing Sites 1 - {Object.keys(siteDataMap).length} (of {sites.length})
      </Text>
      <HeaderSecReportGemeration title="Tree Species" />
      <div
        style={{ gridTemplateColumns: `repeat(${sites.length + 3}, 1fr)` }}
        className="grid divide-y divide-black/10 border-b border-black/10"
      >
        {/* {Title} */}
        <GrdTitleTreeSpecies sites={sites} />
        {/* {Content} */}
        {aggregatedSpecies.map(species => (
          <Fragment key={species.name}>
            <GridsTitleReport
              title={
                <>
                  {species.name}
                  {species.speciesTypes.includes("non-scientific") && " (non-scientific)"}
                  {species.speciesTypes.includes("new") && " (new)"}
                </>
              }
            />
            <GridsContentReport content={species.totalCount.toLocaleString()} />
            {sites.map(site => (
              <GridsContentReport key={site.uuid} content={species.siteCounts[site.uuid]?.toLocaleString() || "-"} />
            ))}
            <GridsContentReport
              content={species.goalCount ? <ProgressBar current={species.totalCount} goal={species.goalCount} /> : "-"}
            />
          </Fragment>
        ))}
        {/* {Footer} */}
        <GridsTitleReport title="Total" />
        <GridsContentReport content={grandTotal.toLocaleString()} />
        {sites.map(site => (
          <GridsContentReport key={site.uuid} content={siteTotals[site.uuid]?.toLocaleString() || "-"} />
        ))}
        <GridsContentReport content="" />
      </div>
    </>
  );
};

const AggregatedTreeSpeciesTable: FC<{
  sites: Site[];
  goalPlants?: TreeSpeciesDto[];
}> = ({ sites, goalPlants = [] }) => {
  const [siteDataMap, setSiteDataMap] = useState<Record<string, TreeSpeciesTableRowData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const siteGroups = useMemo(() => chunk(sites, 3), [sites]);

  const handleSiteDataLoaded = useCallback(
    (data: TreeSpeciesTableRowData[] | undefined, siteUuid: string) => {
      if (!data) return;
      setSiteDataMap(prevMap => {
        if (prevMap[siteUuid]) return prevMap;

        const newMap = { ...prevMap, [siteUuid]: data };

        if (Object.keys(newMap).length === sites.length) {
          setIsLoading(false);
        }

        return newMap;
      });
    },
    [sites.length]
  );

  const goalCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    goalPlants?.forEach(plant => {
      if (plant.name) {
        map[plant.name] = plant.amount || 0;
      }
    });
    return map;
  }, [goalPlants]);

  const aggregatedSpecies = useMemo(() => {
    const speciesMap = new Map<string, TreeSpecies>();

    Object.entries(siteDataMap).forEach(([siteUuid, siteData]) => {
      siteData.forEach(item => {
        const nameData = item.name;
        const name = nameData[0];
        const speciesTypes = nameData[1] || [];
        const count = item.treeCount || 0;

        if (!name) return;

        if (!speciesMap.has(name)) {
          speciesMap.set(name, {
            name,
            speciesTypes,
            totalCount: 0,
            siteCounts: {},
            goalCount: goalCountMap[name]
          });
        }

        const species = speciesMap.get(name)!;
        species.totalCount += count;
        species.siteCounts[siteUuid] = count;

        if (speciesTypes.length > 0) {
          species.speciesTypes = [...new Set([...species.speciesTypes, ...speciesTypes])];
        }
      });
    });

    goalPlants?.forEach(plant => {
      if (plant.name && !speciesMap.has(plant.name)) {
        speciesMap.set(plant.name, {
          name: plant.name,
          speciesTypes: [],
          totalCount: 0,
          siteCounts: {},
          goalCount: plant.amount
        });
      }
    });

    const sortedArray = orderBy(Array.from(speciesMap.values()), ["totalCount"], ["desc"]);

    return sortedArray;
  }, [siteDataMap, goalCountMap, goalPlants]);

  const siteTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    sites.forEach(site => {
      totals[site.uuid] = site.treesPlantedCount;
    });

    return totals;
  }, [sites]);

  const grandTotal = useMemo(() => {
    return aggregatedSpecies.reduce((sum, species) => sum + species.totalCount, 0);
  }, [aggregatedSpecies]);

  return (
    <>
      {!isLoading && aggregatedSpecies.length === 0 ? (
        <Text variant="text-12" className="mb-1 text-center text-black">
          No tree species data available
        </Text>
      ) : (
        <>
          {siteGroups.map((groupSites, index) => (
            <div key={index} className={index > 0 ? "print-page-break" : ""}>
              <TreeSpeciesTableGroup
                sites={groupSites}
                aggregatedSpecies={aggregatedSpecies}
                siteTotals={siteTotals}
                grandTotal={grandTotal}
                siteDataMap={siteDataMap}
              />
            </div>
          ))}
        </>
      )}
      {sites.map(site => (
        <SingleSiteDataComponent key={site.uuid} site={site} onDataLoaded={handleSiteDataLoaded} />
      ))}
    </>
  );
};

export default AggregatedTreeSpeciesTable;
