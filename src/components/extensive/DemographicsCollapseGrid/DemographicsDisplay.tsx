import { useT } from "@transifex/react";
import { FC } from "react";

import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import {
  DemographicEntity,
  DemographicGridVariantProps,
  DemographicType
} from "@/components/extensive/DemographicsCollapseGrid/types";
import { useDemographic } from "@/connections/EntityAssocation";

type DemographicsDisplayProps = {
  entity: DemographicEntity;
  uuid: string;
  type: DemographicType;
  collection: string;
  variant?: DemographicGridVariantProps;
};

const DemographicsDisplay: FC<DemographicsDisplayProps> = ({
  entity,
  uuid,
  type,
  collection,
  variant = GRID_VARIANT_DEFAULT
}) => {
  const t = useT();
  const [, { association: demographic }] = useDemographic({ entity, uuid, type, collection });

  return demographic == null ? null : (
    <DemographicsCollapseGrid
      {...{ variant, type }}
      title={t(demographic.collectionTitle)}
      entries={demographic.entries}
    />
  );
};

export default DemographicsDisplay;
