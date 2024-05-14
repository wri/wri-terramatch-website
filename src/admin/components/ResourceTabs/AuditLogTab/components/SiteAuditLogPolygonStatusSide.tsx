import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { fetchPutV2AdminSitePolygonUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogPolygonStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon
}: {
  refresh?: any;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: any;
  setSelectedPolygon?: any;
}) => {
  const mutate = fetchPutV2AdminSitePolygonUUID;
  return (
    <div className="flex flex-col gap-6">
      <Dropdown
        label="Select Polygon"
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        defaultValue={[selectedPolygon]}
        placeholder={selectedPolygon?.name ?? "Select Polygon"}
        options={polygonList!}
        onChange={e => {
          console.log("onChange", e);
          setSelectedPolygon(e);
        }}
      />
      <StatusDisplay
        titleStatus={"Polygon"}
        name={record?.title || selectedPolygon?.poly_name}
        refresh={refresh}
        mutate={mutate}
        status={record?.meta || selectedPolygon?.meta}
        record={record}
      />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
