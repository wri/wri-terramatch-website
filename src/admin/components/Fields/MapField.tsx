import { Typography } from "@mui/material";
import { useT } from "@transifex/react";
import { get } from "lodash";
import { useId } from "react";
import { useRecordContext } from "react-admin";

import Map from "@/components/elements/Map/Map";

interface MapFieldProps {
  source: string;
  label?: string;
  emptyText?: string;
}

const MapField = ({ source, emptyText = "Not Provided" }: MapFieldProps) => {
  const t = useT();
  const id = useId();

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
    <Map id={id} t={t} geojson={projectBoundary} />
  ) : (
    <Typography component="span" variant="body2">
      {emptyText}
    </Typography>
  );
};

export default MapField;
