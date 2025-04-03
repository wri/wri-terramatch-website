import { useEffect, useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { TableVariant } from "@/components/elements/Table/TableVariants";
import { SitePolygonIndexConnectionProps, useSitePolygons } from "@/connections/SitePolygons";
import { processIndicatorData } from "@/utils/MonitoredIndicatorUtils";

export interface SitePolygonsTableProps {
  entityName: string;
  entityUuid: string;
  searchTerm: string;
  presentIndicator: SitePolygonIndexConnectionProps["presentIndicator"];
  TABLE_COLUMNS_MAPPING: Record<string, any>;
  variant?: TableVariant;
}

const SitePolygonsTable = ({
  entityName,
  entityUuid,
  searchTerm,
  presentIndicator,
  TABLE_COLUMNS_MAPPING,
  variant
}: SitePolygonsTableProps) => {
  const initPageSize = 5;
  const [queryParams, setQueryParams] = useState<any>({
    per_page: initPageSize,
    page: 1
  });
  const [tableMeta, setTableMeta] = useState<any>();
  const [isLoaded, { sitePolygons, total }] = useSitePolygons({
    entityName,
    entityUuid,
    search: searchTerm,
    pageSize: queryParams.per_page,
    pageNumber: queryParams.page,
    presentIndicator: presentIndicator
  });

  useEffect(() => {
    setTableMeta({
      pageSize: queryParams.per_page,
      last_page: total != null && total > +queryParams.per_page ? Math.ceil(total / +queryParams.per_page) : 1
    });
  }, [total, queryParams]);
  const columns = presentIndicator ? TABLE_COLUMNS_MAPPING[presentIndicator] : [];

  return (
    <ServerSideTable
      meta={tableMeta}
      data={sitePolygons ? processIndicatorData(sitePolygons, presentIndicator ?? "") : []}
      onQueryParamChange={setQueryParams}
      columns={columns}
      variant={variant}
      isLoading={!isLoaded}
      defaultPageSize={initPageSize}
    />
  );
};

export default SitePolygonsTable;
