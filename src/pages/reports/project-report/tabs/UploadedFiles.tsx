import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useDate } from "@/hooks/useDate";

interface UploadedFilesTabProps {
  report: any;
}

const UploadedFilesTab = ({ report }: UploadedFilesTabProps) => {
  const t = useT();
  const { format } = useDate();

  const sections = [
    { name: "Socio Economic", property: "socioeconomic_benefits" },
    { name: "Files", property: "file" },
    { name: "Other Additional Files", property: "other_additional_documents" }
  ];
  console.log("report", report);
  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          {sections.map((section, index) => (
            <PageCard title={t(section.name)} key={index}>
              <If condition={report[section.property] && report[section.property].length > 0}>
                <Then>
                  {report[section.property].map((file: any, index: number) => (
                    <div key={file.uuid}>
                      <h4>Document</h4>
                      <a href={file.url} target="_blank" rel="noreferrer noopenner">
                        {file.file_name}
                      </a>
                      <p>Date uploaded: {format(file.created_date)}</p>
                      <p>Visibility: {file.is_public ? "Public" : "Private"}</p>
                    </div>
                  ))}
                </Then>
                <Else>
                  <EmptyState
                    title={t("Files not found")}
                    subtitle={t("Your files will appear here once they are uploaded")}
                    iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
                  />
                </Else>
              </If>
            </PageCard>
          ))}
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default UploadedFilesTab;
