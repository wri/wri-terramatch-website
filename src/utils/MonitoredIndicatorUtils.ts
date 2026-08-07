import { isEmpty } from "lodash";

import { MonitoredIndicator } from "@/admin/components/ResourceTabs/MonitoredTab/hooks/useMonitoredData";
import { Indicator } from "@/connections/SitePolygons";
import {
  IndicatorHectaresDto,
  IndicatorTreeCoverDto,
  IndicatorTreeCoverLossDto,
  SitePolygonLightDto
} from "@/generated/v3/researchService/researchServiceSchemas";

type EcoRegionCategory = "australasian" | "afrotropical" | "paleartic" | "neotropical";

const categoriesFromEcoRegion: Record<EcoRegionCategory, string[]> = {
  australasian: ["Southeast Australia temperate forests", "Palawan rain forests", "Naracoorte woodlands"],
  afrotropical: [
    "Southern Miombo woodlands",
    "Northern Acacia-Commiphora bushlands and thickets",
    "Southern Rift montane forest-grassland mosaic",
    "Northwestern Congolian lowland forests",
    "Albertine Rift montane forests",
    "Sahelian Acacia savanna",
    "Northern Congolian forest-savanna mosaic",
    "Nigerian lowland forests",
    "West Sudanian savanna",
    "Eastern Guinean forests",
    "Victoria Basin forest-savanna mosaic",
    "Guinean forest-savanna mosaic",
    "East Sudanian savanna",
    "Central Zambezian Miombo woodlands",
    "Ethiopian montane grasslands and woodlands",
    "Central African mangroves",
    "Southern Acacia-Commiphora bushlands and thickets",
    "East African montane forests",
    "Eastern Arc forests",
    "Guinean mangroves",
    "Eastern Zimbabwe montane forest-grassland mosaic",
    "Somali Acacia-Commiphora bushlands and thickets",
    "Ethiopian montane forests",
    "Inner Niger Delta flooded savanna",
    "Western Guinean lowland forests",
    "Eastern Miombo woodlands",
    "Cross-Sanaga-Bioko coastal forests",
    "Zambezian and Mopane woodlands",
    "Southern Congolian forest-savanna mosaic",
    "East African montane moorlands",
    "Cameroonian Highlands forests",
    "Cross-Niger transition forests",
    "Madagascar lowland forests",
    "Madagascar subhumid forests"
  ],
  paleartic: [
    "Iberian sclerophyllous and semi-deciduous forests",
    "Northwest Iberian montane forests",
    "Southwest Iberian Mediterranean sclerophyllous and mixed forests",
    "Celtic broadleaf forests",
    "Atlantic mixed forests",
    "Narmada Valley dry deciduous forests",
    "Gulf of Oman desert and semi-desert"
  ],
  neotropical: [
    "Tocantins/Pindare moist forests",
    "Tapajós-Xingu moist forests",
    "Mato Grosso seasonal forests",
    "Xingu-Tocantins-Araguaia moist forests",
    "Bahia coastal forests",
    "Atlantic Coast restingas",
    "Sinú Valley dry forests",
    "Santa Marta montane forests",
    "Petén-Veracruz moist forests",
    "Central American Atlantic moist forests",
    "Central American montane forests",
    "Sierra Madre de Chiapas moist forests"
  ]
};

export const replaceTextWithParams = (params: Record<string, string | number>, text: string): string => {
  return Object.entries(params).reduce((result, [key, value]) => {
    const escapedKey = key.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return result.replace(new RegExp(escapedKey, "g"), value?.toString() || "");
  }, text);
};

export const getOrderTop3 = <T extends { value: number }>(data: T[]): T[] => {
  return [...data].sort((a, b) => b.value - a.value).slice(0, 3);
};

export const getKeyValue = (data: { [key: string]: number }) => {
  if (data) {
    const name = Object?.keys(data!)?.[0];
    const value = data[name];
    return { name: name, value: value };
  }
};

export const calculatePercentage = (value: number, total: number): number => {
  if (!total) return 0;
  return Math.round(Number(((value / total) * 100).toFixed(1)));
};

export const formatDescriptionIndicator = (
  items: { [key: string]: number | undefined },
  totalHectares: number,
  percentage?: boolean,
  baseText?: string
) => {
  const validItems = Object.entries(items)
    .filter(([, value]) => value != null && !Number.isNaN(value))
    .map(
      ([key, value]) =>
        `<b>${key}</b> with <b>${value} ha </b>${
          percentage ? `(<b>${calculatePercentage(value!, totalHectares)}%</b>)` : ""
        }`
    );

  if (validItems.length == 0) return "";

  const formattedItems =
    validItems.length == 1
      ? validItems[0]
      : validItems.slice(0, -1).join(", ") + " and " + validItems[validItems.length - 1];

  if (baseText) return `${baseText} ${formattedItems}`;
  return formattedItems;
};

const formattedValue = (value: number | null | undefined, decimals: number): string | null => {
  if (value == null || Number.isNaN(value)) return null;
  if (value === 0) return "0";
  return value.toFixed(decimals);
};

const toNumberOrNull = (val: number | string | null | undefined): number | null => {
  if (val == null) return null;
  const num = typeof val === "string" ? parseFloat(val) : Number(val);
  return Number.isNaN(num) ? null : num;
};

const assignPresentNumber = (
  source: Record<string, number | string | null | undefined> | undefined,
  apiKey: string,
  dataKey: string,
  target: Record<string, number>
) => {
  if (source == null || !(apiKey in source)) return;
  const num = toNumberOrNull(source[apiKey]);
  if (num != null) {
    target[dataKey] = num;
  }
};

const getEcoRegionCategory = (region: string): EcoRegionCategory | null => {
  for (const category in categoriesFromEcoRegion) {
    if (categoriesFromEcoRegion[category as EcoRegionCategory].includes(region)) {
      return category as EcoRegionCategory;
    }
  }
  return null;
};

export const processIndicatorData = (presentIndicator: Indicator) => (polygons: SitePolygonLightDto[]) => {
  if (isEmpty(polygons)) {
    return [];
  }

  return polygons
    .filter(sitePolygon => sitePolygon.status === "approved")
    .map(sitePolygon => {
      const indicator = sitePolygon?.indicators?.find(
        (ind: { indicatorSlug: string }) => ind.indicatorSlug === presentIndicator
      );

      if (indicator == null) return null;

      const commonFields = {
        polygonName: sitePolygon.name,
        size: formattedValue(sitePolygon.calcArea, 1),
        status: sitePolygon.status,
        plantStart: formatDate(sitePolygon.plantStart),
        siteId: sitePolygon.siteId,
        polygonUuid: sitePolygon.polygonUuid,
        siteName: sitePolygon.siteName
      };

      switch (presentIndicator) {
        case "treeCover": {
          const treeCover = indicator as IndicatorTreeCoverDto;
          return {
            ...commonFields,
            yearOfAnalysis: treeCover.yearOfAnalysis,
            percentCover: treeCover.percentCover,
            projectPhase: treeCover.projectPhase,
            plusMinusPercent: treeCover.plusMinusPercent
          };
        }

        case "treeCoverLoss":
        case "treeCoverLossFires": {
          const treeCoverLoss = indicator as IndicatorTreeCoverLossDto;
          return {
            ...commonFields,
            siteName: sitePolygon.siteName,
            data: {
              "2010": formattedValue(treeCoverLoss.value?.["2010"] ?? 0, 3),
              "2011": formattedValue(treeCoverLoss.value?.["2011"] ?? 0, 3),
              "2012": formattedValue(treeCoverLoss.value?.["2012"] ?? 0, 3),
              "2013": formattedValue(treeCoverLoss.value?.["2013"] ?? 0, 3),
              "2014": formattedValue(treeCoverLoss.value?.["2014"] ?? 0, 3),
              "2015": formattedValue(treeCoverLoss.value?.["2015"] ?? 0, 3),
              "2016": formattedValue(treeCoverLoss.value?.["2016"] ?? 0, 3),
              "2017": formattedValue(treeCoverLoss.value?.["2017"] ?? 0, 3),
              "2018": formattedValue(treeCoverLoss.value?.["2018"] ?? 0, 3),
              "2019": formattedValue(treeCoverLoss.value?.["2019"] ?? 0, 3),
              "2020": formattedValue(treeCoverLoss.value?.["2020"] ?? 0, 3),
              "2021": formattedValue(treeCoverLoss.value?.["2021"] ?? 0, 3),
              "2022": formattedValue(treeCoverLoss.value?.["2022"] ?? 0, 3),
              "2023": formattedValue(treeCoverLoss.value?.["2023"] ?? 0, 3),
              "2024": formattedValue(treeCoverLoss.value?.["2024"] ?? 0, 3),
              "2025": formattedValue(treeCoverLoss.value?.["2025"] ?? 0, 3)
            }
          };
        }

        case "restorationByStrategy": {
          const hectares = indicator as IndicatorHectaresDto;
          return {
            ...commonFields,
            siteName: sitePolygon.siteName,
            data: {
              tree_planting: formattedValue(hectares.value?.["tree-planting"], 3),
              assisted_natural_regeneration: formattedValue(hectares.value?.["assisted-natural-regeneration"], 3),
              direct_seeding: formattedValue(hectares.value?.["direct-seeding"], 3)
            }
          };
        }

        case "restorationByEcoRegion": {
          const hectares = indicator as IndicatorHectaresDto;
          const data: Record<EcoRegionCategory, string | null> = {
            australasian: null,
            afrotropical: null,
            paleartic: null,
            neotropical: null
          };

          for (const region in hectares.value) {
            const category = getEcoRegionCategory(region);

            if (category) {
              data[category] = formattedValue(hectares.value[region], 3);
            }
          }

          return {
            ...commonFields,
            siteName: sitePolygon.siteName,
            data: data
          };
        }

        case "restorationByLandUse": {
          const hectares = indicator as IndicatorHectaresDto;
          return {
            ...commonFields,
            siteName: sitePolygon.siteName,
            data: {
              agroforest: formattedValue(hectares.value?.agroforest, 3),
              natural_forest: formattedValue(hectares.value?.["natural-forest"], 3),
              mangrove: formattedValue(hectares.value?.mangrove, 3)
            }
          };
        }

        default:
          return commonFields;
      }
    })
    .filter(row => row != null);
};

const formatDate = (dateString?: null | string | number | Date) => {
  if (dateString == null) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const transformSitePolygonsToIndicators = (
  polygons: SitePolygonLightDto[],
  indicatorSlug: Indicator
): MonitoredIndicator[] => {
  if (isEmpty(polygons)) {
    return [];
  }

  return polygons
    .filter(sitePolygon => sitePolygon.status === "approved")
    .map(sitePolygon => {
      const currentYear = new Date().getFullYear();
      const indicatorsBySlug = sitePolygon?.indicators?.filter(
        (ind: { indicatorSlug: string; yearOfAnalysis?: number }) => ind.indicatorSlug === indicatorSlug
      );

      const indicator =
        indicatorsBySlug?.find(
          (ind: { indicatorSlug: string; yearOfAnalysis?: number }) => ind.yearOfAnalysis === currentYear
        ) ?? indicatorsBySlug?.[0];

      if (indicator == null) return null;

      const baseIndicator: MonitoredIndicator = {
        polygonName: sitePolygon.name ?? undefined,
        status: sitePolygon.status ?? undefined,
        plantStart: sitePolygon.plantStart ? formatDate(sitePolygon.plantStart) : undefined,
        siteName: sitePolygon.siteName ?? undefined,
        polygonUuid: sitePolygon.polygonUuid ?? undefined,
        siteId: sitePolygon.siteId ?? undefined,
        createdAt: sitePolygon.createdAt ?? undefined,
        indicatorSlug,
        yearOfAnalysis: (indicator as { yearOfAnalysis?: number }).yearOfAnalysis
      };

      switch (indicatorSlug) {
        case "treeCoverLoss":
        case "treeCoverLossFires": {
          const treeCoverLoss = indicator as IndicatorTreeCoverLossDto;
          const yearKeys = [
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
            "2025"
          ] as const;

          const transformedData: Record<string, number> = {};
          for (const year of yearKeys) {
            transformedData[year] = toNumberOrNull(treeCoverLoss.value?.[year]) ?? 0;
          }

          return {
            ...baseIndicator,
            data: transformedData
          };
        }

        case "restorationByStrategy": {
          const hectares = indicator as IndicatorHectaresDto;
          const data: Record<string, number> = {};
          const knownKeys = ["tree-planting", "assisted-natural-regeneration", "direct-seeding"] as const;

          assignPresentNumber(hectares.value, "tree-planting", "tree_planting", data);
          assignPresentNumber(hectares.value, "assisted-natural-regeneration", "assisted_natural_regeneration", data);
          assignPresentNumber(hectares.value, "direct-seeding", "direct_seeding", data);

          if (hectares.value) {
            Object.keys(hectares.value).forEach(key => {
              if (!knownKeys.includes(key as (typeof knownKeys)[number])) {
                assignPresentNumber(hectares.value, key, key.replace(/-/g, "_"), data);
              }
            });
          }

          return {
            ...baseIndicator,
            data
          };
        }

        case "restorationByEcoRegion": {
          const hectares = indicator as IndicatorHectaresDto;
          const data: Record<string, number> = {};

          for (const region in hectares.value) {
            const category = getEcoRegionCategory(region);
            if (!category) continue;
            const value = toNumberOrNull(hectares.value[region]);
            if (value != null) {
              data[category] = (data[category] ?? 0) + value;
            }
          }

          return {
            ...baseIndicator,
            data
          };
        }

        case "restorationByLandUse": {
          const hectares = indicator as IndicatorHectaresDto;
          const data: Record<string, number> = {};
          const knownKeys = ["agroforest", "natural-forest", "mangrove", "silvopasture"] as const;

          assignPresentNumber(hectares.value, "agroforest", "agroforest", data);
          assignPresentNumber(hectares.value, "natural-forest", "natural_forest", data);
          assignPresentNumber(hectares.value, "mangrove", "mangrove", data);
          assignPresentNumber(hectares.value, "silvopasture", "silvopasture", data);

          if (hectares.value) {
            Object.keys(hectares.value).forEach(key => {
              if (!knownKeys.includes(key as (typeof knownKeys)[number])) {
                assignPresentNumber(hectares.value, key, key.replace(/-/g, "_"), data);
              }
            });
          }

          return {
            ...baseIndicator,
            data
          };
        }

        default:
          return baseIndicator;
      }
    })
    .filter((row): row is MonitoredIndicator => row != null);
};

const sumPolygonTreeCoverLoss = (polygon: MonitoredIndicator): number => {
  if (polygon.data == null) return 0;

  return Object.values(polygon.data).reduce((total, value) => total + (typeof value === "number" ? value : 0), 0);
};

export type TreeCoverLossPolygonCounts = {
  withLoss: number;
  noLossDetected: number;
};

export const getTreeCoverLossPolygonCounts = (polygons: MonitoredIndicator[]): TreeCoverLossPolygonCounts =>
  polygons.reduce<TreeCoverLossPolygonCounts>(
    (counts, polygon) => {
      if (sumPolygonTreeCoverLoss(polygon) > 0) {
        counts.withLoss += 1;
      } else {
        counts.noLossDetected += 1;
      }
      return counts;
    },
    { withLoss: 0, noLossDetected: 0 }
  );
