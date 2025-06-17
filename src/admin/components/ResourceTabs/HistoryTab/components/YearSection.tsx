import { FC } from "react";

import Text from "@/components/elements/Text/Text";

import FileDownloadButton from "./FileDownloadButton";

interface YearSectionProps {
  year: string;
  files?: string[];
}

const YearSection: FC<YearSectionProps> = ({ year, files }) => {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="text-14-bold" className="text-blueCustom-900">
        {year}
      </Text>
      {files?.map(fileName => (
        <FileDownloadButton key={fileName} fileName={fileName} />
      ))}
      {files?.length === 0 && (
        <Text variant="text-16-light" className="text-blueCustom-900">
          None
        </Text>
      )}
    </div>
  );
};

export default YearSection;
