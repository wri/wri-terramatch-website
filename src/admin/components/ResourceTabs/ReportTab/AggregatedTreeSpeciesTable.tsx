import { Card, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { orderBy } from "lodash";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTableData } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";

// Interfaces
interface SiteInfo {
  id: string;
  uuid: string;
  name: string;
  treesPlantedCount: number;
  frameworkKey?: string;
  status?: string;
  updateRequestStatus?: string;
}

interface TreeSpecies {
  name: string;
  speciesTypes: string[];
  totalCount: number;
  siteCounts: Record<string, number>;
}

interface TreeSpeciesTableRowData {
  name: [string, string[]];
  uuid: string;
  treeCount: number;
  goalCount?: number;
  treeCountGoal?: [number, number];
}

// Define SingleSiteDataComponent outside main component
const SingleSiteDataComponent: FC<{
  site: SiteInfo;
  onDataLoaded: (data: TreeSpeciesTableRowData[] | undefined, siteUuid: string) => void;
}> = ({ site, onDataLoaded }) => {
  const siteData = useTableData({
    entity: "sites",
    entityUuid: site.uuid,
    collection: "tree-planted",
    tableType: "noGoal",
    plants: []
  });

  // Use ref to track if we've already processed this data
  const processedRef = useRef(false);

  useEffect(() => {
    // Only process data if it exists and hasn't been processed yet
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

// Main component
const AggregatedTreeSpeciesTable: FC<{ sites: SiteInfo[] }> = ({ sites }) => {
  const [siteDataMap, setSiteDataMap] = useState<Record<string, TreeSpeciesTableRowData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Use a callback to prevent recreating this function on each render
  const handleSiteDataLoaded = useCallback(
    (data: TreeSpeciesTableRowData[] | undefined, siteUuid: string) => {
      if (!data) return;

      setSiteDataMap(prevMap => {
        // Skip if we already have data for this site
        if (prevMap[siteUuid]) return prevMap;

        // Add site data to the map
        const newMap = { ...prevMap, [siteUuid]: data };

        // Check if all sites are processed
        if (Object.keys(newMap).length === sites.length) {
          setIsLoading(false);
        }

        return newMap;
      });
    },
    [sites.length]
  );

  // Process all site data to create aggregated species data
  const aggregatedSpecies = useMemo(() => {
    const speciesMap = new Map<string, TreeSpecies>();

    // Process data for each site
    Object.entries(siteDataMap).forEach(([siteUuid, siteData]) => {
      // Process each species in the site
      siteData.forEach(item => {
        const nameData = item.name;
        const name = nameData[0];
        const speciesTypes = nameData[1] || [];
        const count = item.treeCount || 0;

        if (!name) return;

        // Get or create species entry
        if (!speciesMap.has(name)) {
          speciesMap.set(name, {
            name,
            speciesTypes,
            totalCount: 0,
            siteCounts: {}
          });
        }

        // Update species data
        const species = speciesMap.get(name)!;
        species.totalCount += count;
        species.siteCounts[siteUuid] = count;

        // Ensure we keep any special markers (like "new" or "non-scientific")
        if (speciesTypes.length > 0) {
          species.speciesTypes = [...new Set([...species.speciesTypes, ...speciesTypes])];
        }
      });
    });

    // Sort by total count
    const sortedArray = orderBy(Array.from(speciesMap.values()), ["totalCount"], ["desc"]);

    return sortedArray;
  }, [siteDataMap]);

  // Calculate progress
  const progress = sites.length > 0 ? (Object.keys(siteDataMap).length / sites.length) * 100 : 0;

  // Calculate total trees per site (for the footer row)
  const siteTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    // Use the pre-calculated treesPlantedCount for each site
    sites.forEach(site => {
      totals[site.uuid] = site.treesPlantedCount;
    });

    return totals;
  }, [sites]);

  // Grand total across all species
  const grandTotal = useMemo(() => {
    return aggregatedSpecies.reduce((sum, species) => sum + species.totalCount, 0);
  }, [aggregatedSpecies]);

  return (
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
            </TableRow>
          </TableBody>
        </Table>
      )}
      {sites.map(site => (
        <SingleSiteDataComponent key={site.uuid} site={site} onDataLoaded={handleSiteDataLoaded} />
      ))}
    </Card>
  );
};

export default AggregatedTreeSpeciesTable;
