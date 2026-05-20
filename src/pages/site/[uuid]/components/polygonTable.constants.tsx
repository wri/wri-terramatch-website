import { Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
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
  PlusIcon,
  SilvopastureIcon,
  TreePlantingIcon,
  UrbanForestIcon,
  WetlandIcon,
  WoodlotIcon
} from "@/redesignComponents/foundations/Icons";

type SiteTypeConfig = { icon: ReactNode; label: string; tooltip?: string };

const TARGET_LAND_USE_MAP: Record<targetLandUseType, SiteTypeConfig> = {
  agroforest: {
    icon: <AgroforestyIcon boxSize={3.5} />,
    label: "Agroforest"
  },
  "agricultural-land": {
    icon: <AgriculturalLandIcon boxSize={3.5} />,
    label: "Agricultural Land"
  },
  grassland: {
    icon: <GrasslandIcon boxSize={3.5} />,
    label: "Grassland"
  },
  mangrove: {
    icon: <MangroveIcon boxSize={3.5} />,
    label: "Mangrove"
  },
  "open-natural-ecosystem": {
    icon: <OpenNaturalEcosystemIcon boxSize={3.5} />,
    label: "Open Natural Ecosystem"
  },
  "natural-forest": {
    icon: <NaturalForestIcon boxSize={3.5} />,
    label: "Natural Forest"
  },
  peatland: {
    icon: <PeatlandIcon boxSize={3.5} />,
    label: "Peatland"
  },
  "riparian-area-or-wetland": {
    icon: <WetlandIcon boxSize={3.5} />,
    label: "Riparian Area / Wetland"
  },
  silvopasture: {
    icon: <SilvopastureIcon boxSize={3.5} />,
    label: "Silvopasture"
  },
  "urban-forest": {
    icon: <UrbanForestIcon boxSize={3.5} />,
    label: "Urban Forest"
  },
  "woodlot-or-plantation": {
    icon: <WoodlotIcon boxSize={3.5} />,
    label: "Woodlot / Plantation"
  }
};

const SITE_RESTORATION_STRATEGY_MAP: Record<restorationStrategyType, ReactNode> = {
  "tree-planting": (
    <Tooltip content="Tree planting">
      <TreePlantingIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  ),
  "assisted-natural-regeneration": (
    <Tooltip content="Assisted natural regeneration (ANR)">
      <AssistedNaturalRegenIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  ),
  "direct-seeding": (
    <Tooltip content="Direct seeding">
      <DirectSeedingIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  )
};

export const isRestorationStrategy = (value: string): value is restorationStrategyType => {
  return value === "tree-planting" || value === "assisted-natural-regeneration" || value === "direct-seeding";
};

export const isTargetLandUseType = (value: string): value is targetLandUseType => {
  return value in TARGET_LAND_USE_MAP;
};

export const formatDistributionValue = (value: string): string => {
  return value
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getTargetLandUseConfig = (targetLandUse: targetLandUseType | null) => {
  if (targetLandUse == null) {
    return { icon: null, label: "-" };
  }
  return TARGET_LAND_USE_MAP[targetLandUse];
};

export const renderTargetLandUse = (targetLandUse: targetLandUseType | null) => {
  const targetLandUseConfig = getTargetLandUseConfig(targetLandUse);
  if (targetLandUseConfig.icon == null || targetLandUseConfig.label == null) {
    return <Text>—</Text>;
  }
  return (
    <Flex className="items-center gap-2" color="neutral.800">
      {targetLandUseConfig.icon}
      <Text>{targetLandUseConfig.label}</Text>
    </Flex>
  );
};

export const renderRestorationPractice = (restorationPractice: restorationStrategyType[]) => {
  if (restorationPractice.length === 0) {
    return <Text>—</Text>;
  }

  return (
    <Flex className="items-center gap-2">
      {restorationPractice.map((restorationPracticeType, index) => (
        <Flex key={`${restorationPracticeType}-${index}`} className="items-center gap-2">
          {SITE_RESTORATION_STRATEGY_MAP[restorationPracticeType]}
          {index < restorationPractice.length - 1 && <PlusIcon boxSize={2.5} color="secondary.800" />}
        </Flex>
      ))}
    </Flex>
  );
};
