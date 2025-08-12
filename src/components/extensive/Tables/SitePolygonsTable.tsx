import { useMemo } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { TableVariant } from "@/components/elements/Table/TableVariants";
import { Indicator, sitePolygonsConnection } from "@/connections/SitePolygons";
import { processIndicatorData } from "@/utils/MonitoredIndicatorUtils";

export interface SitePolygonsTableProps {
  entityName: "projects" | "sites";
  entityUuid: string;
  searchTerm: string;
  presentIndicator: Indicator;
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
  const dataProcessor = useMemo(() => processIndicatorData(presentIndicator), [presentIndicator]);
  return (
    <ConnectionTable
      connection={sitePolygonsConnection}
      connectionProps={{
        entityName,
        entityUuid,
        filter: { "presentIndicator[]": [presentIndicator], search: searchTerm }
      }}
      variant={variant}
      columns={presentIndicator ? TABLE_COLUMNS_MAPPING[presentIndicator] : []}
      defaultPageSize={5}
      dataProcessor={dataProcessor}
    />
  );
};

export default SitePolygonsTable;
