import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { applicationExportGet } from "@/generated/v3/entityService/entityServiceComponents";
import Log from "@/utils/log";

interface ApplicationHeaderProps {
  name: string;
  uuid: string;
}

const ApplicationHeader: FC<ApplicationHeaderProps> = ({ name, uuid }) => {
  const t = useT();

  const handleExport = useCallback(async () => {
    try {
      await applicationExportGet.downloadFile({ pathParams: { uuid } });
    } catch (err) {
      Log.error("Failed to fetch applications exports", err);
    }
  }, [uuid]);

  return (
    <PageHeader className="min-h-[203px]" title={name}>
      <Button className="mt-[5.5px]" onClick={handleExport}>
        {t("Download application")}
      </Button>
    </PageHeader>
  );
};

export default ApplicationHeader;
