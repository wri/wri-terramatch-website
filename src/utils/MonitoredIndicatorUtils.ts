type EcoRegionCategory = "australasian" | "afrotropical" | "paleartic" | "neotropical";

const categoriesFromEcoRegion: Record<EcoRegionCategory, string[]> = {
  australasian: [
    "Southeast Australia temperate forests",
    "Tocantins/Pindare moist forests",
    "Tapajós-Xingu moist forests",
    "Mato Grosso seasonal forests",
    "Mato Grosso seasonal forests, Xingu-Tocantins-Araguaia moist forests",
    "Bahia coastal forests",
    "Southern Miombo woodlands",
    "Palawan rain forests"
  ],
  afrotropical: [
    "Atlantic mixed forests",
    "Northern Acacia-Commiphora bushlands and thickets",
    "Southern Rift montane forest-grassland mosaic",
    "Sierra Madre de Chiapas moist forests",
    "Iberian sclerophyllous and semi-deciduous forests",
    "Northwest Iberian montane forests",
    "Northwestern Congolian lowland forests",
    "Albertine Rift montane forests",
    "Sahelian Acacia savanna",
    "Northern Congolian forest-savanna mosaic",
    "Nigerian lowland forests",
    "West Sudanian savanna",
    "Northern Congolian forest-savanna mosaic, Northwestern Congolian lowland forests",
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
    "Ethiopian montane forests, Ethiopian montane grasslands and woodlands",
    "Cross-Sanaga-Bioko coastal forests",
    "Zambezian and Mopane woodlands",
    "Madagascar lowland forests",
    "Madagascar subhumid forests",
    "Southern Congolian forest-savanna mosaic",
    "East African montane forests",
    "East African montane forests, Northern Acacia-Commiphora bushlands and thickets",
    "Albertine Rift montane forests, Lake"
  ],
  paleartic: [
    "Southwest Iberian Mediterranean sclerophyllous and mixed forests",
    "Narmada Valley dry deciduous forests",
    "East African montane moorlands",
    "Cameroonian Highlands forests",
    "Celtic broadleaf forests",
    "Atlantic Coast restingas",
    "Gulf of Oman desert and semi-desert"
  ],
  neotropical: [
    "Sinú Valley dry forests",
    "Santa Marta montane forests",
    "Petén-Veracruz moist forests",
    "Central American Atlantic moist forests",
    "Petén-Veracruz moist forests, Central American Atlantic moist forests",
    "Central American montane forests",
    "Central American Atlantic moist forests, Central American montane forests",
    "Cross-Niger transition forests",
    "Atlantic Coast restingas"
  ]
};

export const replaceTextWithParams = (params: Record<string, any>, text: string): string => {
  return Object.entries(params).reduce((result, [key, value]) => {
    const escapedKey = key.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return result.replace(new RegExp(escapedKey, "g"), value?.toString() || "");
  }, text);
};

export const getOrderTop3 = (data: any[]) => {
  return data.sort((a, b) => b.value - a.value).slice(0, 3);
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
    .filter(([key, value]) => value != undefined && value != null && !Number.isNaN(value))
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

const formattedValue = (value: number, decimals: number) => (value === 0 ? "0" : value?.toFixed(decimals));

const getEcoRegionCategory = (region: string): EcoRegionCategory | null => {
  for (const category in categoriesFromEcoRegion) {
    if (categoriesFromEcoRegion[category as EcoRegionCategory].includes(region)) {
      return category as EcoRegionCategory;
    }
  }
  return null;
};

export const processIndicatorData = (apiResponse: any[], presentIndicator: string) => {
  if (!apiResponse || !Array.isArray(apiResponse)) {
    return [];
  }

  const response = apiResponse
    .map(sitePolygon => {
      const indicator = sitePolygon?.indicators?.find(
        (ind: { indicatorSlug: string }) => ind.indicatorSlug === presentIndicator
      );

      if (!indicator) return null;

      const commonFields = {
        poly_name: sitePolygon.name,
        size: formattedValue(sitePolygon.calcArea, 1),
        status: sitePolygon.status,
        plantstart: formatDate(sitePolygon.plantStart),
        site_id: sitePolygon.siteId,
        poly_id: sitePolygon.id,
        siteName: sitePolygon.siteName
      };

      switch (presentIndicator) {
        case "treeCover":
          return {
            ...commonFields,
            yearOfAnalysis: indicator.yearOfAnalysis,
            percentCover: indicator.percentCover,
            projectPhase: indicator.projectPhase,
            plusMinusPercent: indicator.plusMinusPercent
          };

        case "treeCoverLoss":
        case "treeCoverLossFires":
          return {
            ...commonFields,
            site_name: sitePolygon.siteName || sitePolygon.site_name,
            data: {
              "2010": formattedValue(indicator.value?.["2010"], 3),
              "2011": formattedValue(indicator.value?.["2011"], 3),
              "2012": formattedValue(indicator.value?.["2012"], 3),
              "2013": formattedValue(indicator.value?.["2013"], 3),
              "2014": formattedValue(indicator.value?.["2014"], 3),
              "2015": formattedValue(indicator.value?.["2015"], 3),
              "2016": formattedValue(indicator.value?.["2016"], 3),
              "2017": formattedValue(indicator.value?.["2017"], 3),
              "2018": formattedValue(indicator.value?.["2018"], 3),
              "2019": formattedValue(indicator.value?.["2019"], 3),
              "2020": formattedValue(indicator.value?.["2020"], 3),
              "2021": formattedValue(indicator.value?.["2021"], 3),
              "2022": formattedValue(indicator.value?.["2022"], 3),
              "2023": formattedValue(indicator.value?.["2023"], 3),
              "2024": formattedValue(indicator.value?.["2024"], 3),
              "2025": formattedValue(indicator.value?.["2025"], 3)
            },
            created_at: indicator.created_at
          };

        case "restorationByStrategy":
          return {
            ...commonFields,
            site_name: sitePolygon.siteName,
            base_line: indicator.baseline,
            data: {
              tree_planting: indicator.value?.["tree-planting"]
                ? formattedValue(indicator.value?.["tree-planting"], 3)
                : 0,
              assisted_natural_regeneration: indicator.value?.["assisted-natural-regeneration"]
                ? formattedValue(indicator.value?.["assisted-natural-regeneration"], 3)
                : 0,
              direct_seeding: indicator.value?.["direct-seeding"]
                ? formattedValue(indicator.value?.["direct-seeding"], 3)
                : 0
            }
          };

        case "restorationByEcoRegion": {
          const data: Record<EcoRegionCategory, string | null> = {
            australasian: null,
            afrotropical: null,
            paleartic: null,
            neotropical: null
          };

          for (const region in indicator.value) {
            const category = getEcoRegionCategory(region);

            if (category) {
              data[category] = formattedValue(indicator.value[region], 3);
            }
          }

          return {
            ...commonFields,
            site_name: sitePolygon.siteName,
            base_line: indicator.baseline,
            data: data
          };
        }

        case "restorationByLandUse":
          return {
            ...commonFields,
            site_name: sitePolygon.siteName,
            base_line: indicator.baseline,
            data: {
              agroforest: indicator.value?.agroforest ? formattedValue(indicator.value?.agroforest, 3) : 0,
              natural_forest: indicator.value?.natural_forest ? formattedValue(indicator.value?.natural_forest, 3) : 0,
              mangrove: indicator.value?.mangrove ? formattedValue(indicator.value?.mangrove, 3) : 0
            }
          };

        default:
          return commonFields;
      }
    })
    .filter(Boolean);

  return response;
};

const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
