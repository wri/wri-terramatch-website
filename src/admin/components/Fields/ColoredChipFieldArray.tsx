import classNames from "classnames";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";
import { useGetV2SitesSitePolygon } from "@/generated/apiComponents";

interface ColoredChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
}

const POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP: { [key: string]: string } = {
  Approved: "!bg-green-30 tag-approved-color",
  Submitted: "!bg-blue-200 tag-submitted-color",
  Draft: "!bg-grey-200 tag-draft-color",
  "Needs info": "!bg-tertiary-50 tag-need-info-color",
  Unknown: ""
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
  const { data: getPolygonsToSite } = useGetV2SitesSitePolygon({ pathParams: { site: recordContext.uuid } });

  if (!getPolygonsToSite?.length || !Array.isArray(getPolygonsToSite)) {
    return (
      <div className="text-14 w-fit-content whitespace-nowrap rounded-[3px] bg-grey-200 px-2 text-grey-500">
        {props.emptyText ?? "Not Provided"}
      </div>
    );
  }

  const groupedPolygons = groupPolygonsByStatus(getPolygonsToSite);

  return (
    <ArrayField {...props} record={{ [props.source!]: groupedPolygons }}>
      <SingleFieldList linkType={false}>
        <FunctionField
          render={(record: { status: string; count: number }) => {
            const status = record?.status;
            const choice = props.choices.find(i => i.id === status);
            const PolygonStatusLabel = record?.count + " " + choice?.name!;
            return (
              <ChipField
                record={{ status: PolygonStatusLabel }}
                source="status"
                className={classNames(
                  "!h-fit !rounded-[3px] capitalize",
                  POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP[choice?.name!]
                )}
              />
            );
          }}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default ColoredChipFieldArray;
