import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { fetchGetV2ApplicationsUUIDExport } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils";

interface ApplicationHeaderProps {
  name: string;
  uuid: string;
  status?: string;
}

const ApplicationHeader = ({ name, status, uuid }: ApplicationHeaderProps) => {
  const t = useT();

  const handleExport = async () => {
    try {
      const res = await fetchGetV2ApplicationsUUIDExport({
        pathParams: {
          uuid: uuid
        }
      });
      if (!res) return;
      return downloadFileBlob(res, "Application.csv");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageHeader className="min-h-[203px]" title={name}>
      <When condition={status && status !== "started"}>
        <Button className="mt-[5.5px]" onClick={handleExport}>
          {t("Download application")}
        </Button>
      </When>
    </PageHeader>
  );
};

export default ApplicationHeader;
