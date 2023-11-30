import { Typography } from "@mui/material";
import { get } from "lodash";
import { useRecordContext } from "react-admin";

import Map from "@/components/elements/Map-mapbox/Map";

interface MapFieldProps {
  source: string;
  label?: string;
  emptyText?: string;
}

const MapField = ({ source, emptyText = "Not Provided" }: MapFieldProps) => {
  const record = useRecordContext<any>();

  let projectBoundary: any;
  if (record) {
    const field = get(record, source);

    try {
      projectBoundary = JSON.parse(field);
    } catch (e) {
      projectBoundary = undefined;
    }
  }

  return record && projectBoundary ? (
    <Map geojson={projectBoundary} />
  ) : (
    <Typography component="span" variant="body2">
      {emptyText}
    </Typography>
  );
};

export default MapField;
