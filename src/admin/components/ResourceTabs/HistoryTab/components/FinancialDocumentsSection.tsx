import { FC } from "react";

import YearSection from "./YearSection";

interface IProps {
  files: { year: string; files: string[] }[];
}

const FinancialDocumentsSection: FC<IProps> = ({ files }) => {
  return (
    <div className="flex flex-col gap-4">
      {files?.map(({ year, files }) => (
        <YearSection key={year} year={year} files={files} />
      ))}
    </div>
  );
};

export default FinancialDocumentsSection;
