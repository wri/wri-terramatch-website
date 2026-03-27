import { Grid } from "@chakra-ui/react";
import { FC } from "react";

import { ParsedFile } from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import AttachFileItem from "@/pages/project/[uuid]/components/AttachFileItem";

type DocumentsSectionProps = {
  files: ParsedFile[];
};

const DocumentsSection: FC<DocumentsSectionProps> = ({ files }) => (
  <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4}>
    {files.map(file => (
      <AttachFileItem
        key={file.fileUrl}
        fileName={file.fileName}
        onClick={() => window.open(file.fileUrl, "_blank")}
        fileType={file.fileType}
      />
    ))}
  </Grid>
);

export default DocumentsSection;
