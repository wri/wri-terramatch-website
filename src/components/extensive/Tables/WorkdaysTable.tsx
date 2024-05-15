import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import { getWorkdaysTableColumns } from "@/components/elements/Inputs/DataTable/RHFWorkdaysTable";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { GetV2WorkdaysENTITYUUIDResponse, useGetV2WorkdaysENTITYUUID } from "@/generated/apiComponents";
import { useGetOptions } from "@/hooks/useGetOptions";
import { SingularEntityName } from "@/types/common";

export interface WorkdaysTableProps {
  modelName: SingularEntityName;
  modelUUID: string;
  collection: string;
  hasCountColumn?: boolean;
  onFetch?: (data: GetV2WorkdaysENTITYUUIDResponse) => void;
}

const WorkdaysTable = ({ modelName, modelUUID, collection, onFetch }: WorkdaysTableProps) => {
  const t = useT();

  const [queryParams, setQueryParams] = useState<any>({ page: 1, per_page: 5 });
  queryParams["filter[collection]"] = collection;

  const { data: workdays, isLoading } = useGetV2WorkdaysENTITYUUID(
    {
      queryParams,
      pathParams: { entity: modelName, uuid: modelUUID }
    },
    {
      enabled: !!queryParams,
      keepPreviousData: true,
      onSuccess: data => onFetch?.(data)
    }
  );

  const ethnicityOptions = useGetOptions(workdays?.data?.map(workday => workday?.ethnicity || "") || []);
  const columns = useMemo(() => {
    const columns = getWorkdaysTableColumns(t, ethnicityOptions);

    columns[columns.length - 1].header = t("Count ({total})", {
      total:
        //@ts-ignore
        workdays?.meta?.count_total || 0
    });
    return columns;
    //@ts-ignore
  }, [ethnicityOptions, t, workdays?.meta?.count_total]);

  return (
    <div>
      <ServerSideTable
        meta={workdays?.meta}
        data={workdays?.data || []}
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={columns}
      />
    </div>
  );
};

export default WorkdaysTable;
