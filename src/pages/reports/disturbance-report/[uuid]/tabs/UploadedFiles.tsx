import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import ButtonField from "@/components/elements/Field/ButtonField";
import Paper from "@/components/elements/Paper/Paper";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

interface UploadedFilesTabProps {
  report: any;
}

const sections = [{ name: "Media Assets", property: "media" }];

const UploadedFilesTab = ({ report }: UploadedFilesTabProps) => {
  const t = useT();

  const totalFiles = useMemo(
    () => sections?.reduce((total, section) => total + report[section?.property]?.length, 0),
    [report]
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard>
            {totalFiles === 0 ? (
              <h3>{t("Files not found")}</h3>
            ) : (
              <>
                {sections.map(section => {
                  return report[section?.property]?.map((file: any) => (
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
                  ));
                })}
              </>
            )}
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default UploadedFilesTab;
