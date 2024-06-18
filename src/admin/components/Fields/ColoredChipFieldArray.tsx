import { Typography } from "@mui/material";
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
                className={classNames("!h-fit !rounded-[3px]", POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP[choice])}
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
