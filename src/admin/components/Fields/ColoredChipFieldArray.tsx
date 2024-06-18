import { Typography } from "@mui/material";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";
import { useGetV2SitesSitePolygon } from "@/generated/apiComponents";

interface ColoredChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
}

const POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP: { [key: string]: string } = {
  Approved: "bg-green-30 text-green-100",
  Rejected: "bg-error-400 text-error-600",
  "Under Review": "bg-yellow-300 text-yellow-700",
  "Awaiting approval": "bg-yellow-300 text-yellow-700",
  "Planting in progress": "bg-yellow-300 text-yellow-700",
  Draft: "bg-yellow-300 text-yellow-700",
  Unknown: "",
  "Needs more information": "bg-yellow-300 text-yellow-700"
};

const ColoredChipFieldArray = (props: ColoredChipFieldArrayProps) => {
  const recordContext = useRecordContext();
  const { data: getPolygonsToSite } = useGetV2SitesSitePolygon({ pathParams: { site: recordContext.uuid } });
  //fix: RA crashes when null or undefined passed to an arrayField
  if (!getPolygonsToSite || !Array.isArray(getPolygonsToSite)) {
    return (
      <Typography component="span" variant="body2">
        {props.emptyText || "Not Provided"}
      </Typography>
    );
  }

  const statusCounts = getPolygonsToSite.reduce((acc: { [key: string]: number }, polygon: any) => {
    const status = polygon.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusList = Object.keys(statusCounts).map(status => ({
    id: status,
    status,
    count: statusCounts[status]
  }));

  console.log(statusList);
  return (
    <ArrayField {...props} record={{ [props.source!]: getPolygonsToSite }}>
      <SingleFieldList linkType={false}>
        <FunctionField
          render={(record: any) => {
            const status = record?.status;
            const choice = props.choices.find(i => i.id === status)?.name;

            return choice ? (
              <ChipField
                record={{ status: choice }}
                source="status"
                className={POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP[choice]}
              />
            ) : (
              <Typography component="span" variant="body2">
                Not Provided
              </Typography>
            );
          }}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default ColoredChipFieldArray;
