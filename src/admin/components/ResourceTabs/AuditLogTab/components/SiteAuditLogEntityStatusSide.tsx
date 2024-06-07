import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Notification from "@/components/elements/Notification/Notification";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { usePostV2AuditStatus } from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import { SelectedItem } from "@/hooks/useLoadEntityList";
import { recentRequestData } from "@/utils/statusUtils";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogEntityStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  auditLogData,
  recordType = "Polygon",
  mutate,
  getValueForStatus,
  progressBarLabels,
  tab,
  checkPolygonsSite,
  viewPD = false
}: {
  recordType?: "Polygon" | "Site" | "Project";
  refresh?: () => void;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: SelectedItem | null;
  setSelectedPolygon?: Dispatch<SetStateAction<SelectedItem | null>> | null;
  auditLogData?: AuditStatusResponse[];
  mutate?: any;
  getValueForStatus?: (status: string) => number;
  progressBarLabels?: Array<{ id: string; label: string }>;
  tab?: string;
  checkPolygonsSite?: boolean | undefined;
  viewPD?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const recentRequest = auditLogData?.find(
    (item: AuditStatusResponse) => item.type == "change-request" && item.is_active
  );
  const mutateUpload = recordType === "Project" ? usePostV2AuditStatus : usePostV2AuditStatus;
  const { mutate: upload } = mutateUpload();

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
          refresh && refresh();
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      {polygonList && polygonList?.length > 0 && (
        <Dropdown
          label={`Select ${recordType}`}
          labelVariant="text-16-bold"
          labelClassName="capitalize"
          optionsClassName="max-w-full"
          value={[selectedPolygon?.uuid ?? ""]}
          placeholder={`Select ${recordType}`}
          options={polygonList!}
          onChange={e => {
            console.log("onChange", e);
            setSelectedPolygon && setSelectedPolygon(polygonList?.find(item => item?.uuid === e[0]));
          }}
        />
      )}
      <Text variant="text-16-bold">{`${recordType} Status`}</Text>
      <StepProgressbar
        color="secondary"
        value={(getValueForStatus && getValueForStatus(record?.status)) ?? 0}
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
        titleStatus={recordType}
        name={recordType}
        refresh={refresh}
        mutate={mutate}
        record={record}
        tab={tab}
        checkPolygonsSite={checkPolygonsSite}
        viewPD={viewPD}
      />
      <Notification open={open} type="success" title="Success!" message="Your Change Request was just removed!" />
    </div>
  );
};

export default SiteAuditLogEntityStatusSide;
