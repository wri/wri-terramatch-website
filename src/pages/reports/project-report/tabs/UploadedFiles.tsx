import { useT } from "@transifex/react";
import Link from "next/link";
import { Then } from "react-if";

import ButtonField from "@/components/elements/Field/ButtonField";
import Paper from "@/components/elements/Paper/Paper";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

interface UploadedFilesTabProps {
  report: any;
}

const UploadedFilesTab = ({ report }: UploadedFilesTabProps) => {
  const t = useT();

  const sections = [
    { name: "Socio Economic", property: "socioeconomic_benefits" },
    { name: "Files", property: "file" },
    { name: "Other Additional Files", property: "other_additional_documents" }
  ];

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard>
            {sections.map((section, index) => (
              <Then key={index}>
                {report[section.property].map((file: any) => (
                  <Paper key={file.uuid}>
                    <ButtonField
                      key={file.uuid}
                      label={t(section.name)}
                      subtitle={t(file.file_name)}
                      buttonProps={{
                        as: Link,
                        children: t("Download"),
                        href: file.url,
                        download: true
                      }}
                    />
                  </Paper>
                ))}
              </Then>
            ))}
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default UploadedFilesTab;
