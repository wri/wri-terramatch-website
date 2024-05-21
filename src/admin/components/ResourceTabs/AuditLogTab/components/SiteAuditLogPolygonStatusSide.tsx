import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { fetchPutV2AuditStatusId } from "@/generated/apiComponents";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const polygonStatusLabels = [
  { id: "1", label: "Submitted" },
  { id: "2", label: "Needs More Information" },
  { id: "3", label: "Approved" }
];

function getValueForStatus(status: string): number {
  switch (status) {
    case "Submitted":
      return 0;
    case "needs-more-information":
      return 50;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

const SiteAuditLogPolygonStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  auditLogData
}: {
  refresh?: any;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: any;
  setSelectedPolygon?: any;
  auditLogData?: any;
}) => {
  const recentRequest = auditLogData?.find((item: any) => item.type == "change-request" && item.is_active);
  const mutate = fetchPutV2AuditStatusId;
  const deactivateRecentRequest = async () => {
    await mutate({
      pathParams: {
        id: recentRequest?.id
      },
      body: {
        is_active: false,
        request_removed: true
      }
    });
    refresh();
  };

  const unnamedPolygons = polygonList?.map((polygon: any) => {
    if (!polygon.title) {
      return { ...polygon, title: "Unnamed Polygon" };
    }
    return polygon;
  });
  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <Dropdown
        label="Select Polygon"
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        value={[selectedPolygon?.uuid]}
        placeholder={"Select Polygon"}
        options={unnamedPolygons!}
        onChange={e => {
          console.log("onChange", e);
          setSelectedPolygon(polygonList?.find(item => item.uuid === e[0]));
        }}
      />
      <Text variant="text-16-bold">Polygon Status</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus(record?.meta)}
        labels={polygonStatusLabels}
        classNameLabels="min-w-[111px]"
        className="w-[98%] !pl-[6%]"
      />

      {recentRequest && (
        <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-3">
          <div>
            <div className="flex items-baseline justify-between">
              <Text variant="text-16-bold">Change Requested</Text>
              <button onClick={deactivateRecentRequest} className="text-12-bold text-tertiary-600">
                Remove Request
              </button>
            </div>
            <Text variant="text-14-light">From Liza LePage on 13/06/24</Text>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      )}
      <StatusDisplay
        titleStatus={"Polygon"}
        name={selectedPolygon?.title}
        refresh={refresh}
        mutate={mutate}
        record={record}
        setSelectedPolygon={setSelectedPolygon}
      />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
