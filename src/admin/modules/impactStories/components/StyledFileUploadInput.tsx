import React from "react";

import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";

const StyledFileUploadInput = (props: any) => {
  return (
    <FileUploadInput
      {...props}
      sx={{
        "&": {
          position: "relative"
        },
        "& .RaLabeled-label": {
          marginBottom: "8px"
        },
        "& .RaLabeled-label span": {
          fontSize: "14px",
          fontWeight: "bold",
          color: "black",
          fontFamily: "Inter"
        },
        "& .RaFileInput-dropZone": {
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #E3E3E3"
        },
        "& .RaFileInput-dropZone:hover": {
          border: "1px dashed #E3E3E3"
        },
        "& .previews": {
          position: "absolute",
          top: "30px",
          left: "calc(100% + 16px)",
          width: "100%",
          height: "100%"
        },
        "& .previews a": {
          backgroundColor: "#F2F2F2",
          padding: "8px",
          borderRadius: "4px",
          color: "#676D71",
          textDecoration: "none"
        }
      }}
    />
  );
};

export default StyledFileUploadInput;
