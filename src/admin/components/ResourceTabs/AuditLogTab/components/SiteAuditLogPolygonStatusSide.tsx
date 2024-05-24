import classNames from "classnames";
import { useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Notification from "@/components/elements/Notification/Notification";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { fetchPutV2AdminSitePolygonUUID, usePostV2AuditStatus } from "@/generated/apiComponents";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

interface auditLogItem {
  type: string;
  is_active: boolean;
  id: number;
  comment: string;
}

const SiteAuditLogPolygonStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  auditLogData,
  recentRequestData,
  recordType = "Polygon",
  mutate,
  getValueForStatus,
  progressBarLabels
}: {
  recordType?: string;
  refresh?: any;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: any;
  setSelectedPolygon?: any;
  auditLogData?: any;
  recentRequestData?: any;
  mutate?: any;
  getValueForStatus?: any;
  progressBarLabels?: any;
}) => {
  const [open, setOpen] = useState(false);
  const recentRequest = auditLogData?.find((item: auditLogItem) => item.type == "change-request" && item.is_active);
  const { mutate: upload } = usePostV2AuditStatus();
  const mutateSitePolygons = fetchPutV2AdminSitePolygonUUID;
  const deactivateRecentRequest = async () => {
    upload?.(
      {
        //@ts-ignore swagger issue
        body: {
          entity_uuid: record?.uuid,
          status: record?.status,
          entity: recordType === "Polygon" ? "SitePolygon" : recordType,
          comment: "",
          type: "change-request",
          is_active: false,
          request_removed: true
        }
      },
      {
        onSuccess: () => {
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 3000);
          refresh();
        }
      }
    );
  };

  const unnamedPolygons = polygonList?.map((polygon: any) => {
    if (!polygon.title) {
      return { ...polygon, title: `Unnamed ${recordType}` };
    }
    return polygon;
  });
  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <Dropdown
        label={`Select ${recordType}`}
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        value={[selectedPolygon?.uuid]}
        placeholder={`Select ${recordType}`}
        options={unnamedPolygons!}
        onChange={e => {
          console.log("onChange", e);
          setSelectedPolygon(polygonList?.find(item => item?.uuid === e[0]));
        }}
      />
      <Text variant="text-16-bold">{`${recordType} Status`}</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus(record?.meta)}
        labels={progressBarLabels}
        classNameLabels="min-w-[99px] "
        className={classNames("w-[98%] pl-[1%]", recordType === "Polygon" && "pl-[6%]")}
      />
      {recentRequest && (
        <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-3">
          <div>
            <div className="flex items-baseline justify-between">
              <Text variant="text-16-bold">Change Requested</Text>
              <button onClick={deactivateRecentRequest} className="text-14-bold text-tertiary-600">
                Remove
              </button>
            </div>
            <Text variant="text-14-light">{recentRequestData(recentRequest)}</Text>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      )}
      <StatusDisplay
        titleStatus={recordType as any}
        name={selectedPolygon?.title}
        refresh={refresh}
        mutate={mutateSitePolygons}
        record={record}
        setSelectedPolygon={setSelectedPolygon}
      />
      <Notification open={open} type="success" title="Success!" message="Your Change Request was just removed!" />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
