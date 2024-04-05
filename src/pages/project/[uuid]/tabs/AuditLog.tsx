import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ENTITYUUIDReports } from "@/generated/apiComponents";

interface ReportingTasksProps {
  project: any;
}

const AuditLog = ({ project }: ReportingTasksProps) => {
  const t = useT();
  const { data: reports, isLoading } = useGetV2ENTITYUUIDReports(
    {
      pathParams: { entity: "projects", uuid: project.uuid }
    },
    { keepPreviousData: true }
  );
  console.log(reports, "REPORTS");

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="grid w-[70%] gap-8">
                <div>
                  <Text variant="text-24-bold" className="flex flex-1 items-baseline">
                    {t("Project Status and Comments")}
                  </Text>
                  <Text variant="text-14-light" className="">
                    {t("Update the site status, view updates, or add comments")}
                  </Text>
                </div>
                <Text variant="text-16-bold" className="mt-8">
                  Audit Log
                </Text>
                <div>
                  <div className="flex py-4 opacity-60">
                    <Text variant="text-12-bold" className="w-[12%]">
                      Date and Time
                    </Text>
                    <Text variant="text-12-bold" className="w-[19%]">
                      User
                    </Text>
                    <div className="w-[17%]">Site</div>
                    <div className="w-[14%]">Status</div>
                    <div className="w-[38%]">Comments</div>
                  </div>
                  <div>
                    <div className="flex border-b border-neutral-200">
                      <div className="w-[12%]">28/11/2023 09.39</div>
                      <div className="w-[19%]">Jessica Chaimers</div>
                      <div className="w-[17%]">-</div>
                      <div className="w-[14%]">Need More Information</div>
                      <div className="w-[38%]">-</div>
                    </div>
                    <div className="flex">
                      <div className="w-[12%]">28/11/2023 09.39</div>
                      <div className="w-[19%]">Teresa Muthoni</div>
                      <div className="w-[17%]">-</div>
                      <div className="w-[14%]">Need More Information</div>
                      <div className="w-[38%]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageCard>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default AuditLog;
