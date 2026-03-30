import { Flex, Grid, Text } from "@chakra-ui/react";
import { FC } from "react";

import { ParsedFile } from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import AttachFileItem from "@/pages/project/[uuid]/components/AttachFileItem";
import { DocumentIcon } from "@/redesignComponents/foundations/Icons";
import { useT } from "@transifex/react";

type DocumentsSectionProps = {
  files: ParsedFile[];
  showTitle?: boolean;
};

const DocumentsSection: FC<DocumentsSectionProps> = ({ files, showTitle = false }) =>{
  const t = useT();
  return (
  <Flex direction="column" gap={3}>
    {showTitle && (
      <Text display="flex" alignItems="center" gap={1} lineHeight="normal" textStyle="300-bold" color="primary.900">
        {<DocumentIcon boxSize={3.5} color="primary.900" />}
        {t("Documents")}
      </Text>
    )}
    <Grid templateColumns={files.length === 1 ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))"} gap={4}>
      {files.map(file => (
        <AttachFileItem
          key={file.fileUrl}
          fileName={file.fileName}
          onClick={() => window.open(file.fileUrl, "_blank")}
          fileType={file.fileType}
        />
      ))}
    </Grid>
  </Flex>
  );
};

export default DocumentsSection;
