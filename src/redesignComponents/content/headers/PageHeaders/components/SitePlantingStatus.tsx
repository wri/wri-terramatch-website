import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import router from "next/router";
import { FC, ReactNode } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import {
  AgriculturalLandIcon,
  AgroforestyIcon,
  AssistedNaturalRegenIcon,
  DirectSeedingIcon,
  GrasslandIcon,
  InfoIcon,
  MangroveIcon,
  NaturalForestIcon,
  OpenNaturalEcosystemIcon,
  PeatlandIcon,
  SilvopastureIcon,
  TreePlantingIcon,
  UrbanForestIcon,
  WetlandIcon,
  WoodlotIcon
} from "@/redesignComponents/foundations/Icons";

type SiteTypeConfig = { icon: ReactNode; label: string; tooltip?: string };

const SITE_RESTORATION_STRATEGY_MAP: Record<string, SiteTypeConfig> = {
  "tree-planting": {
    icon: <TreePlantingIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Tree Planting",
    tooltip:
      "Tree planting is defined as the planting of seedlings or saplings over an area to meet specific goals. This includes all planting, including areas with no forest canopy and in areas with partial canopy coverage."
  },
  "assisted-natural-regeneration": {
    icon: <AssistedNaturalRegenIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Assisted Natural Regeneration",
    tooltip:
      "Assisted natural regeneration is the exclusion of threats (i.e. grazing, fire, invasive plants) that prevent natural regrowth from seeds and roots already present in the soil or from natural seed dispersal from nearby trees. This does not include any tree planting."
  },
  "direct-seeding": {
    icon: <DirectSeedingIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Direct Seeding",
    tooltip:
      "Direct seeding is the active dispersal of seeds (preferably ecologically diverse, native seed mixes) that accelerate natural regrowth, provided the area is protected from disturbances. It includes only active collection and dispersal of seeds and excludes any natural dispersal that would occur without human intervention. This does not include any tree planting."
  }
};

const SITE_TARGET_LAND_USE_MAP: Record<string, SiteTypeConfig> = {
  agroforest: {
    icon: <AgroforestyIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Agroforesty",
    tooltip:
      "An agroforest is productive, managed land containing a mix of woody perennial species (trees, shrubs, bamboos) and agricultural crops in a way that improves the agricultural productivity and ecological function of a site. This category includes agroforestry for shade grown crops (cacao, coffee), as well as planting trees at a low density to allow for continued full-sun agriculture, also known as intercropping or row cropping. Please note that silvopasture is its own separate land use system."
  },
  "agricultural-land": {
    icon: <AgriculturalLandIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Agricultural Land",
    tooltip:
      "A natural forest ecosystem is a rural landscape where the majority of trees are native species and features biologically integrated communities of plants, animals and microbes, together with the local soils (substrates) and atmospheres (climates) with which they interact."
  },
  grassland: {
    icon: <GrasslandIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Grassland"
  },
  mangrove: {
    icon: <MangroveIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Mangrove"
  },
  "open-natural-ecosystem": {
    icon: <OpenNaturalEcosystemIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Open Natural Ecosystem",
    tooltip:
      "Open Natural Ecosystems mainly comprise naturally open and often treeless habitats, ranging from savannas and scrublands to grasslands, ravines and dunes. Grasslands are generally open and continuous, fairly flat areas of grass. They are often located between temperate forests at high latitudes and deserts at subtropical latitudes."
  },
  "natural-forest": {
    icon: <NaturalForestIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Natural Forest"
  },
  peatland: {
    icon: <PeatlandIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Peatland",
    tooltip:
      "Peatlands are terrestrial wetland ecosystems in which waterlogged conditions prevent plant material from fully decomposing."
  },
  "riparian-area-or-wetland": {
    icon: <WetlandIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Riparian Area / Wetland",
    tooltip:
      "Wetlands are areas where the soil is covered with water or can be present near the ground throughout the year, including marshes, swamps, bogs, and fens. They support both terrestrial and aquatic species. Riparian ecosystems encompass a suite of ecosystem types, including river banks, floodplains, and wetlands, that are characterized primarily by being transitional zones between terrestrial and aquatic realms."
  },
  silvopasture: {
    icon: <SilvopastureIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Silvopasture",
    tooltip:
      "A silvopasture system is productive, managed land containing a mix of woody perennial species (trees, shrubs, bamboos) and animal forage or pasture land to improve the agricultural productivity and ecological function of a site for continued use as pasture. "
  },
  "urban-forest": {
    icon: <UrbanForestIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Urban Forest",
    tooltip:
      "An urban forest encompasses the trees and shrubs in an urban area, including trees in yards, along streets and utility corridors, in protected areas, and in watersheds. This includes individual trees, street trees, green spaces with trees, and even the associated vegetation and the soil beneath the trees."
  },
  "woodlot-or-plantation": {
    icon: <WoodlotIcon className="h-8 w-8 text-theme-secondary-800" />,
    label: "Woodlot / Plantation",
    tooltip:
      "A plantation is a forest predominantly composed of intensively managed trees that are established through planting and/or deliberate seeding, with the explicit goal of harvesting and processing those trees for wood once they reach maturity. A woodlot is a type of plantation, predominantly managed by a single landholder or a community, to supply wood for construction and fuel to the landholder or community."
  }
};

const SitePlantingStatus: FC<{ site: SiteFullDto }> = ({ site }) => {
  const t = useT();
  const restorationStrategyKey =
    site.restorationStrategy != null
      ? Array.isArray(site.restorationStrategy)
        ? site.restorationStrategy[0]
        : site.restorationStrategy
      : null;
  const restorationStrategyConfig =
    restorationStrategyKey != null ? SITE_RESTORATION_STRATEGY_MAP[restorationStrategyKey] ?? null : null;

  const targetLandUseKeys: string[] =
    site.landUseTypes != null ? (Array.isArray(site.landUseTypes) ? site.landUseTypes : [site.landUseTypes]) : [];
  const targetLandUseConfigs = targetLandUseKeys
    .map(key => SITE_TARGET_LAND_USE_MAP[key])
    .filter((c): c is SiteTypeConfig => c != null);

  const MAX_VISIBLE_LAND_USE = 2;
  const visibleLandUseConfigs = targetLandUseConfigs.slice(0, MAX_VISIBLE_LAND_USE);
  const hiddenCount = targetLandUseConfigs.length - MAX_VISIBLE_LAND_USE;

  return (
    <Box
      width="fit-content"
      height="auto"
      className="flex flex-col gap-5 pt-5 mobile:!w-full"
      css={{ "&": { alignItems: "self-end !important" } }}
    >
      <Flex
        className="items-start gap-5 mobile:w-full mobile:max-w-full mobile:overflow-x-auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          "&": { msOverflowStyle: "none", scrollbarWidth: "none" }
        }}
      >
        <div className="flex w-fit flex-col justify-center gap-2">
          <Text color="primary.900" textStyle="300" textWrap="nowrap">
            {t("Restoration Strategy:")}
          </Text>
          <Flex className="w-auto flex-col" alignItems="center" gap={2}>
            {restorationStrategyConfig?.icon != null ? (
              <>
                {restorationStrategyConfig.icon}
                <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                  {t(restorationStrategyConfig.label)}{" "}
                  {restorationStrategyConfig.tooltip != null && (
                    <Tooltip
                      content={
                        <>
                          <span className="text-sm font-semibold">{t(restorationStrategyConfig.label)}: </span>
                          {t(restorationStrategyConfig.tooltip)}
                        </>
                      }
                    >
                      <InfoIcon className="h-3 w-3 text-theme-neutral-800" />
                    </Tooltip>
                  )}
                </Text>
              </>
            ) : (
              <Text textStyle="400-bold" color="neutral.600" className="text-center leading-5">
                {t("N/A")}
              </Text>
            )}
          </Flex>
        </div>
        <div className="flex h-full w-fit items-center">
          <div className="h-13 w-px bg-theme-neutral-300" />
        </div>
        <div className="flex w-fit flex-col justify-center gap-2">
          <Text color="primary.900" textStyle="300" textWrap="nowrap">
            {t("Target Land Use:")}
          </Text>
          <Flex className="w-auto" alignItems="center" gap={3}>
            {visibleLandUseConfigs.length > 0 ? (
              visibleLandUseConfigs.map((config, idx) => (
                <Flex key={targetLandUseKeys[idx]} className="flex-col" minWidth={"8.5rem"} alignItems="center" gap={1}>
                  {config.icon}
                  <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                    {t(config.label)}{" "}
                    {config.tooltip != null && (
                      <Tooltip
                        content={
                          <>
                            <span className="text-sm font-semibold">{t(config.label)}: </span>
                            {t(config.tooltip)}
                          </>
                        }
                      >
                        <InfoIcon className="h-3 w-3 text-theme-neutral-800" />
                      </Tooltip>
                    )}
                  </Text>
                </Flex>
              ))
            ) : (
              <Text textStyle="400-bold" color="neutral.600" className="text-center leading-5">
                {t("N/A")}
              </Text>
            )}
            {hiddenCount > 0 && (
              <Button variant="borderless" onClick={() => router.push(`/site/${site.uuid}?tab=details`)}>
                {t("+{count} More", { count: hiddenCount })}
              </Button>
            )}
          </Flex>
        </div>
      </Flex>
    </Box>
  );
};

export default SitePlantingStatus;
