import { useT } from "@transifex/react";
import { useMemo } from "react";

import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import { Demographic, DemographicalType } from "@/components/extensive/DemographicsCollapseGrid/types";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useGetV2RestorationPartnersENTITYUUID, useGetV2WorkdaysENTITYUUID } from "@/generated/apiComponents";

interface DemographicCounts {
  gender: number;
  age: number;
  ethnicity: number;
}

interface HBFDemographicCounts {
  gender: number;
  age: number;
  caste: number;
}

function getInitialCounts<T extends Framework>(framework: T) {
  return framework === Framework.HBF
    ? ({
        gender: 0,
        age: 0,
        caste: 0
      } as HBFDemographicCounts)
    : ({
        gender: 0,
        age: 0,
        ethnicity: 0
      } as DemographicCounts);
}

export type FrameworkDemographicCountTypes<T extends Framework> = T extends Framework.HBF
  ? HBFDemographicCounts
  : DemographicCounts;

interface Demographical {
  collection: string;
  readable_collection: string;
  demographics?: Demographic[];
}

type DemographicalReturnType =
  | ReturnType<typeof useGetV2WorkdaysENTITYUUID>
  | ReturnType<typeof useGetV2RestorationPartnersENTITYUUID>;

const DEMOGRAPHIC_HOOKS: { [k in DemographicalType]: (entityType: string, uuid: string) => DemographicalReturnType } = {
  workdays: (entityType, uuid) =>
    useGetV2WorkdaysENTITYUUID({ pathParams: { entity: entityType, uuid } }, { keepPreviousData: true }),
  restorationPartners: (entityType, uuid) =>
    useGetV2RestorationPartnersENTITYUUID({ pathParams: { entity: entityType, uuid } }, { keepPreviousData: true })
};

export default function useDemographicData(
  entityType: string,
  demographicalType: DemographicalType,
  uuid: string,
  collections: string[],
  titlePrefix: string
) {
  const t = useT();
  const { framework } = useFrameworkContext();

  const useGetDemographicalData = DEMOGRAPHIC_HOOKS[demographicalType];
  const { data: response } = useGetDemographicalData(entityType, uuid);
  const data = (response as any)?.data as Demographical[];

  return useMemo(
    function () {
      const demographicals = data?.filter(demographical => collections.includes(demographical.collection!));

      const grids =
        demographicals == null
          ? []
          : collections.map(collection => {
              const demographical = demographicals.find(demographical => demographical.collection === collection);
              const { readable_collection, demographics } = demographical ?? {};
              return {
                grid: (
                  <DemographicsCollapseGrid
                    key={collection}
                    title={t(readable_collection)}
                    demographics={demographics ?? []}
                    variant={GRID_VARIANT_DEFAULT}
                    demographicalType={demographicalType}
                  />
                ),
                collection
              };
            });

      const initialCounts = getInitialCounts(framework);

      function isHBFDemographicCounts(
        counts: HBFDemographicCounts | DemographicCounts,
        framework: Framework
      ): counts is HBFDemographicCounts {
        return framework === Framework.HBF;
      }

      const counts = demographicals?.reduce((counts, { demographics }) => {
        return (
          demographics?.reduce((counts, { type, amount }) => {
            const typedType = type as keyof FrameworkDemographicCountTypes<typeof framework>;
            if (typedType in counts) {
              return {
                ...counts,
                [typedType]: counts[typedType] + amount
              };
            }

            return counts;
          }, counts) ?? counts
        );
      }, initialCounts);

      let total: number | undefined;

      if (counts) {
        if (isHBFDemographicCounts(counts, framework)) {
          total = Math.max(counts.age, counts.gender, counts.caste);
        } else {
          total = Math.max(counts.age, counts.gender, counts.ethnicity);
        }
      }

      const title = t(`${titlePrefix} - {total}`, { total: total ?? "...loading" });
      return { grids, title };
    },
    [data, collections, framework, t, titlePrefix]
  );
}
