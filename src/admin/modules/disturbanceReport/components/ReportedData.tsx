import { FC } from "react";
import { When } from "react-if";

import DisturbanceReport from "./DisturbanceReport";
import { DisturbanceReports } from "./MockedData";

const ReportedData: FC = () => {
  return (
    <div className="flex flex-col gap-8 p-6">
      {DisturbanceReports.map((report, index) => (
        <>
          <DisturbanceReport id={report.id} key={report.id} index={index} />
          <When condition={index !== DisturbanceReports.length - 1}>
            <hr className="border-[#EAEAEA]" />
          </When>
        </>
      ))}
    </div>
  );
};

export default ReportedData;
