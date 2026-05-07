import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dispatch, FC, SetStateAction } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { AuditStatusEntityType, formatAuditStatusEntityForDisplay } from "@/connections/AuditStatus";
import { SelectedItem } from "@/hooks/AuditStatus/useLoadEntityList";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay";

type SiteAndAuditLogEntityStatusSideProps = {
  entityType: AuditStatusEntityType;
  refresh?: () => void;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: SelectedItem | null;
  setSelectedPolygon?: Dispatch<SetStateAction<SelectedItem | null>> | null;
  getValueForStatus?: (status: string) => number;
  progressBarLabels?: Array<{ id: string; label: string }>;
  showChangeRequest?: boolean;
  checkPolygonsSite?: boolean | undefined;
  viewPD?: boolean;
  onStatusChange?: (status: string, comment: string) => Promise<void>;
  onChangeRequest?: (comment: string) => void;
};

const SiteAuditLogEntityStatusSide: FC<SiteAndAuditLogEntityStatusSideProps> = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  entityType = "sitePolygons",
  getValueForStatus,
  progressBarLabels,
  showChangeRequest = false,
  checkPolygonsSite,
  viewPD = false,
  onStatusChange,
  onChangeRequest
}) => {
  const displayEntityName = formatAuditStatusEntityForDisplay(entityType);
  const t = useT();

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      {polygonList != null && polygonList.length > 0 && (
        <Dropdown
          label={t("Select ${displayEntityName}", { displayEntityName })}
          labelVariant="text-16-bold"
          labelClassName="capitalize"
          optionsClassName="max-w-full"
          value={[selectedPolygon?.uuid ?? ""]}
          placeholder={t("Select {displayEntityName}", { displayEntityName })}
          options={polygonList}
          onChange={e => {
            setSelectedPolygon?.(polygonList.find(item => item?.uuid === e[0]));
          }}
        />
      )}
      <Text variant="text-16-bold">{t("{displayEntityName} Status", { displayEntityName })}</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus?.(record?.status) ?? 0}
        labels={progressBarLabels}
        classNameLabels="min-w-[52px] lg:min-w-[99px] !text-[9.5px] md:!text-[11px] lg:!text-[12px] wide:!text-[14px]"
        className={classNames("w-[98%] pl-[1%]", entityType === "sitePolygons" && "pl-[6%]")}
      />
      <StatusDisplay
        titleStatus={entityType}
        name={displayEntityName}
        refresh={refresh}
        record={record}
        showChangeRequest={showChangeRequest}
        checkPolygonsSite={checkPolygonsSite}
        viewPD={viewPD}
        onStatusChange={onStatusChange}
        onChangeRequest={onChangeRequest}
      />
    </div>
  );
};

export default SiteAuditLogEntityStatusSide;
