import classNames from "classnames";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";
import { useSitePolygonSummary } from "@/connections/SitePolygons";
import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

interface ColoredChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
}

type GroupedPolygonStatus = {
  status: string;
  count: number;
};

const POLYGON_STATUS_CLASSNAME_MAP: Record<string, string> = {
  [POLYGON_APPROVED]: "!bg-green-30 tag-approved-color",
  [POLYGON_PENDING_APPROVAL]: "!bg-blue-200 tag-submitted-color",
  [POLYGON_DRAFT]: "!bg-grey-200 tag-draft-color",
  [POLYGON_INFORMATION_REQUIRED]: "!bg-tertiary-50 tag-need-info-color"
};

const ColoredChipFieldArray = (props: ColoredChipFieldArrayProps) => {
  const recordContext = useRecordContext();
  const [, { data: summaryData }] = useSitePolygonSummary({
    entityName: "sites",
    entityUuid: recordContext.uuid,
    enabled: recordContext.uuid != null
  });
  const countByStatus = summaryData?.countByStatus;
  const groupedPolygons: GroupedPolygonStatus[] = props.choices
    .map(choice => ({
      status: String(choice.id),
      count: countByStatus?.[choice.id] ?? 0
    }))
    .filter(group => group.count > 0);

  if (groupedPolygons.length === 0) {
    return (
      <div className="text-14 w-fit-content whitespace-nowrap rounded-[3px] bg-grey-200 px-2 text-grey-500">
        {props.emptyText ?? "Not Provided"}
      </div>
    );
  }

  return (
    <ArrayField {...props} record={{ [props.source!]: groupedPolygons }}>
      <SingleFieldList linkType={false}>
        <FunctionField
          render={(record?: GroupedPolygonStatus) => {
            if (record == null) return null;
            const status = record.status;
            const choice = props.choices.find(i => i.id === status);
            const polygonStatusLabel = `${record.count} ${choice?.name ?? status}`;
            return (
              <ChipField
                record={{ status: polygonStatusLabel }}
                source="status"
                className={classNames("!h-fit !rounded-[3px] capitalize", POLYGON_STATUS_CLASSNAME_MAP[status])}
              />
            );
          }}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default ColoredChipFieldArray;
