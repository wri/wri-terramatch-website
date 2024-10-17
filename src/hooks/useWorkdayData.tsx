import { useT } from "@transifex/react";
import { useMemo } from "react";

import { Demographic } from "@/components/extensive/WorkdayCollapseGrid/types";
import WorkdayCollapseGrid from "@/components/extensive/WorkdayCollapseGrid/WorkdayCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/WorkdayCollapseGrid/WorkdayVariant";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { GetV2WorkdaysENTITYUUIDResponse } from "@/generated/apiComponents";

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

export type DemographicCountsType = keyof DemographicCounts;
export type HBFDemographicCountsType = keyof HBFDemographicCounts;

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

export interface Workday {
  collection: string;
  readable_collection: string;
  demographics?: Demographic[];
}

export default function useWorkdayData(
  response: GetV2WorkdaysENTITYUUIDResponse | undefined,
  workdayCollection: string[],
  titlePrefix: string
) {
  const t = useT();
  const { framework } = useFrameworkContext();

  return useMemo(
    function () {
      const filteredCollections = response?.data?.filter(workday =>
        workdayCollection.includes(workday?.collection as string)
      );
      const workdays = filteredCollections as Workday[];

      const grids =
        workdays == null
          ? []
          : workdayCollection.map(collection => {
              const workday = workdays.find(workday => workday.collection == collection);
              const { readable_collection, demographics } = workday ?? {};
              return {
                grid: (
                  <WorkdayCollapseGrid
                    key={collection}
                    title={t(readable_collection)}
                    demographics={demographics ?? []}
                    variant={GRID_VARIANT_DEFAULT}
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

      const counts = workdays?.reduce((counts, { demographics }) => {
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
    [response, t, titlePrefix, workdayCollection, framework]
  );
}
