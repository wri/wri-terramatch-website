import { Card, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { chunk, orderBy } from "lodash";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTableData } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

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

// Separate progress bar component for better readability
const ProgressBar: FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const progressValue = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div>
      <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 1 }} />
      <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 0.5 }}>
        {current.toLocaleString()} of {goal.toLocaleString()}
      </Typography>
    </div>
  );
};

// Component for a single table with up to 3 sites
const TreeSpeciesTableGroup: FC<{
  sites: Site[];
  aggregatedSpecies: TreeSpecies[];
  siteTotals: Record<string, number>;
  grandTotal: number;
}> = ({ sites, aggregatedSpecies, siteTotals, grandTotal }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "bold" }}>Species Name</TableCell>
          <TableCell align="right" style={{ fontWeight: "bold" }}>
            Total Trees
          </TableCell>
          {sites.map(site => (
            <TableCell key={site.uuid} align="right" style={{ fontWeight: "bold" }}>
              {site.name}
            </TableCell>
          ))}
          <TableCell align="right" style={{ fontWeight: "bold" }}>
            Progress Towards Goal
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {aggregatedSpecies.map(species => (
          <TableRow key={species.name}>
            <TableCell>
              {species.name}
              {species.speciesTypes.includes("non-scientific") && " (non-scientific)"}
              {species.speciesTypes.includes("new") && " (new)"}
            </TableCell>
            <TableCell align="right">{species.totalCount.toLocaleString()}</TableCell>
            {sites.map(site => (
              <TableCell key={site.uuid} align="right">
                {species.siteCounts[site.uuid] ? species.siteCounts[site.uuid].toLocaleString() : "-"}
              </TableCell>
            ))}
            <TableCell align="right">
              {species.goalCount ? <ProgressBar current={species.totalCount} goal={species.goalCount} /> : "-"}
            </TableCell>
          </TableRow>
        ))}
        <TableRow style={{ backgroundColor: "#f5f5f5" }}>
          <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
          <TableCell align="right" style={{ fontWeight: "bold" }}>
            {grandTotal.toLocaleString()}
          </TableCell>
          {sites.map(site => (
            <TableCell key={site.uuid} align="right" style={{ fontWeight: "bold" }}>
              {siteTotals[site.uuid]?.toLocaleString() || "-"}
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const AggregatedTreeSpeciesTable: FC<{
  sites: Site[];
  goalPlants?: TreeSpeciesDto[];
}> = ({ sites, goalPlants = [] }) => {
  const [siteDataMap, setSiteDataMap] = useState<Record<string, TreeSpeciesTableRowData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Calculate site groups - sites divided into chunks of 3
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

  // Create a map of goal counts by species name
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

  const progress = sites.length > 0 ? (Object.keys(siteDataMap).length / sites.length) * 100 : 0;

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
      <Card sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
          Tree Species Planted Across All Sites
        </Typography>

        {isLoading && (
          <div style={{ marginBottom: 16 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Processed {Object.keys(siteDataMap).length} of {sites.length} sites
            </Typography>
          </div>
        )}

        {!isLoading && aggregatedSpecies.length === 0 ? (
          <Typography>No tree species data available</Typography>
        ) : (
          <>
            {/* Render each site group in a separate table for printing */}
            {siteGroups.map((groupSites, index) => (
              <div key={index} className={index > 0 ? "print-page-break" : ""}>
                {index > 0 && (
                  <Typography variant="h6" component="h4" sx={{ mb: 2, mt: 4 }}>
                    Tree Species Planted (Continued)
                  </Typography>
                )}
                <TreeSpeciesTableGroup
                  sites={groupSites}
                  aggregatedSpecies={aggregatedSpecies}
                  siteTotals={siteTotals}
                  grandTotal={grandTotal}
                />
              </div>
            ))}
          </>
        )}
        {sites.map(site => (
          <SingleSiteDataComponent key={site.uuid} site={site} onDataLoaded={handleSiteDataLoaded} />
        ))}
      </Card>
    </>
  );
};

export default AggregatedTreeSpeciesTable;
