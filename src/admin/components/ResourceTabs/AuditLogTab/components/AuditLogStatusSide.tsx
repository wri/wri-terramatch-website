import { Dispatch, SetStateAction } from "react";

import Notification from "@/components/elements/Notification/Notification";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { AuditStatusResponse } from "@/generated/apiSchemas";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const AuditLogStatusSide = ({
  record,
  refresh,
  auditLogData,
  recentRequestData,
  getValueForStatus,
  statusLabels,
  entity,
  upload,
  mutate,
  openModal,
  setOpenModal
}: {
  record?: any;
  upload?: any;
  mutate?: any;
  refresh?: () => void;
  auditLogData?: AuditStatusResponse[];
  recentRequestData?: ((recentRequest: AuditStatusResponse) => string) | undefined;
  getValueForStatus?: (status: string) => number;
  statusLabels?: Array<{ id: string; label: string }>;
  entity: "Site" | "Project" | "Polygon";
  openModal?: boolean;
  setOpenModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const recentRequest = auditLogData?.find(
    (item: AuditStatusResponse) => item.type == "change-request" && item.is_active
  );

  const deactivateRecentRequest = async () => {
    upload?.(
      {
        //@ts-ignore swagger issue
        body: {
          entity_uuid: record?.uuid,
          status: record?.status,
          entity: entity,
          comment: "",
          type: "change-request",
          is_active: false,
          request_removed: true
        }
      },
      {
        onSuccess: () => {
          setOpenModal && setOpenModal(true);
          setTimeout(() => {
            setOpenModal && setOpenModal(false);
          }, 3000);
          refresh && refresh();
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      <Text variant="text-16-bold">{entity} Status</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus ? getValueForStatus(record.status) : 0}
        labels={statusLabels}
        classNameLabels="min-w-[99px]"
        className="w-[99%]"
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
            {recentRequestData && <Text variant="text-14-light">{recentRequestData(recentRequest)}</Text>}
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      )}
      <StatusDisplay titleStatus={entity} name={record.name} refresh={refresh} record={record} mutate={mutate} />
      <Notification
        open={openModal || false}
        type="success"
        title="Success!"
        message="Your Change Request was just removed!"
      />
    </div>
  );
};

export default AuditLogStatusSide;
