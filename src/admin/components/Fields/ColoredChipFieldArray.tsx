import classNames from "classnames";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

interface ColoredChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
}

const POLYGON_STATUS_CLASSNAME_MAP: Record<string, string> = {
  [POLYGON_APPROVED]: "!bg-green-30 tag-approved-color",
  [POLYGON_PENDING_APPROVAL]: "!bg-blue-200 tag-submitted-color",
  [POLYGON_DRAFT]: "!bg-grey-200 tag-draft-color",
  [POLYGON_INFORMATION_REQUIRED]: "!bg-tertiary-50 tag-need-info-color"
};

function groupPolygonsByStatus(polygons: any[]) {
  const groupedPolygons = polygons.reduce((acc, polygon) => {
    const status = polygon?.status;
    if (acc?.[status]) {
      acc[status].count++;
    } else {
      acc[status] = {
        status: status,
        count: 1
      };
    }
    return acc;
  }, {});

  return Object.keys(groupedPolygons).map(key => groupedPolygons[key]);
}

const ColoredChipFieldArray = (props: ColoredChipFieldArrayProps) => {
  const recordContext = useRecordContext();
  const { data: sitePolygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: recordContext.uuid,
    enabled: recordContext.uuid != null
  });

  if (!sitePolygons?.length || !Array.isArray(sitePolygons)) {
    return (
      <div className="text-14 w-fit-content whitespace-nowrap rounded-[3px] bg-grey-200 px-2 text-grey-500">
        {props.emptyText ?? "Not Provided"}
      </div>
    );
  }

  const groupedPolygons = groupPolygonsByStatus(sitePolygons);

  return (
    <ArrayField {...props} record={{ [props.source!]: groupedPolygons }}>
      <SingleFieldList linkType={false}>
        <FunctionField
          render={(record?: { status: string; count: number }) => {
            if (record == null) return null;
            const status = record?.status;
            const choice = props.choices.find(i => i.id === status);
            const PolygonStatusLabel = record?.count + " " + choice?.name!;
            return (
              <ChipField
                record={{ status: PolygonStatusLabel }}
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
