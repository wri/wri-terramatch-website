import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  AgriculturalLandIcon,
  AgroforestyIcon,
  AssistedNaturalRegenIcon,
  DirectSeedingIcon,
  GrasslandIcon,
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

type SiteTypeConfig = { icon: ReactNode; label: string };

const SITE_RESTORATION_STRATEGY_MAP: Record<string, SiteTypeConfig> = {
  "tree-planting": {
    icon: <TreePlantingIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Tree Planting"
  },
  "assisted-natural-regeneration": {
    icon: <AssistedNaturalRegenIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Assisted Natural Regeneration"
  },
  "direct-seeding": {
    icon: <DirectSeedingIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Direct Seeding"
  }
};

const SITE_TARGET_LAND_USE_MAP: Record<string, SiteTypeConfig> = {
  agroforest: {
    icon: <AgroforestyIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Agroforesty"
  },
  "agricultural-land": {
    icon: <AgriculturalLandIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Agricultural Land"
  },
  grassland: {
    icon: <GrasslandIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Grassland"
  },
  mangrove: {
    icon: <MangroveIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Mangrove"
  },
  "open-natural-ecosystem": {
    icon: <OpenNaturalEcosystemIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Open Natural Ecosystem"
  },
  "natural-forest": {
    icon: <NaturalForestIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Natural Forest"
  },
  peatland: {
    icon: <PeatlandIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Peatland"
  },
  "riparian-area-or-wetland": {
    icon: <WetlandIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Riparian Area / Wetland"
  },
  silvopasture: {
    icon: <SilvopastureIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Silvopasture"
  },
  "urban-forest": {
    icon: <UrbanForestIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Urban Forest"
  },
  "woodlot-or-plantation": {
    icon: <WoodlotIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Woodlot / Plantation"
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

  const targetLandUseKey =
    site.landUseTypes != null ? (Array.isArray(site.landUseTypes) ? site.landUseTypes[0] : site.landUseTypes) : null;
  const targetLandUseConfig = targetLandUseKey != null ? SITE_TARGET_LAND_USE_MAP[targetLandUseKey] ?? null : null;

  return (
    <Box
      width="294px"
      minWidth="294px"
      height="auto"
      className="flex flex-col gap-5 pt-5"
      css={{ "&": { alignItems: "self-end !important" } }}
    >
      <Flex className="items-start gap-5">
        <div className="flex w-fit flex-col justify-center gap-2">
          <Text color="primary.900" textStyle="300" textWrap="nowrap">
            {t("Restoration Strategy:")}
          </Text>
          <Flex className="w-auto flex-col" alignItems="center" gap={2}>
            {restorationStrategyConfig != null && restorationStrategyConfig.icon != null ? (
              <>
                {restorationStrategyConfig.icon}
                <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                  {t(restorationStrategyConfig.label)}
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
          <div className="bg-theme-neutral-300 h-13 w-px" />
        </div>
        <div className="flex w-fit flex-col justify-center gap-2">
          <Text color="primary.900" textStyle="300" textWrap="nowrap">
            {t("Target Land Use:")}
          </Text>
          <Flex className="w-auto flex-col" alignItems="center" gap={2}>
            {targetLandUseConfig != null && targetLandUseConfig.icon != null ? (
              <>
                {targetLandUseConfig.icon}
                <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                  {t(targetLandUseConfig.label)}
                </Text>
              </>
            ) : (
              <Text textStyle="400-bold" color="neutral.600" className="text-center leading-5">
                {t("N/A")}
              </Text>
            )}
          </Flex>
        </div>
      </Flex>
    </Box>
  );
};

export default SitePlantingStatus;
