import { useT } from "@transifex/react";
import { useMemo } from "react";

import { Demographic } from "@/components/extensive/WorkdayCollapseGrid/types";
import WorkdayCollapseGrid from "@/components/extensive/WorkdayCollapseGrid/WorkdayCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/WorkdayCollapseGrid/WorkdayVariant";
import { GetV2WorkdaysENTITYUUIDResponse } from "@/generated/apiComponents";

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

  return useMemo(
    function () {
      const workdays = response?.data as Workday[];

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

      const counts = workdays?.reduce(
        (counts, { demographics }) => {
          return (
            demographics?.reduce(
              (counts, { type, amount }) => ({ ...counts, [type]: counts[type] + amount }),
              counts
            ) ?? counts
          );
        },
        { gender: 0, age: 0, ethnicity: 0 }
      );
      const total = counts && Math.max(counts.age, counts.gender, counts.ethnicity);
      const title = t(`${titlePrefix} - {total}`, { total: total ?? "...loading" });

      return { grids, title };
    },
    [response]
  );
}
