import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { TARGET_LAND_USE_LABELS } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import {
  AssistedNaturalRegenIcon,
  DirectSeedingIcon,
  PlusIcon,
  TreePlantingIcon
} from "@/redesignComponents/foundations/Icons";

const RESTORATION_PRACTICE_ICONS: Record<restorationStrategyType, ReactNode> = {
  "tree-planting": (
    <Tooltip content="Tree planting">
      <TreePlantingIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  ),
  "sapling-planting": (
    <Tooltip content="Sapling planting">
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

export const renderRestorationPracticeIcons = (restorationPractice: restorationStrategyType[]) => {
  if (restorationPractice.length === 0) {
    return (
      <Text color="neutral.900" textStyle="400-bold">
        {"\u2014"}
      </Text>
    );
  }

  return (
    <Flex alignItems="center" gap={2}>
      {restorationPractice.map((practice, index) => (
        <Flex key={`${practice}-${index}`} alignItems="center" gap={2}>
          {RESTORATION_PRACTICE_ICONS[practice]}
          {index < restorationPractice.length - 1 && <PlusIcon boxSize={2.5} color="secondary.800" />}
        </Flex>
      ))}
    </Flex>
  );
};

export const renderTargetLandUseLabel = (targetLandUse: targetLandUseType | null) => {
  if (targetLandUse == null) {
    return (
      <Text color="neutral.900" textStyle="400-bold">
        {"\u2014"}
      </Text>
    );
  }

  return (
    <Text color="neutral.900" textStyle="400-bold">
      {TARGET_LAND_USE_LABELS[targetLandUse]}
    </Text>
  );
};
