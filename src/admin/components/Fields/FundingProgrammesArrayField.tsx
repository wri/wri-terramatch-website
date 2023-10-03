import { ArrayField, ArrayFieldProps, FunctionField, Link, UrlField, useCreatePath } from "react-admin";

import modules from "@/admin/modules";
import { LimitedFundingProgrammeRead, V2OrganisationRead } from "@/generated/apiSchemas";

const FundingProgrammesArrayField = (props: Omit<ArrayFieldProps, "children">) => {
  const createPath = useCreatePath();

  return (
    <ArrayField {...props} source="project_pitches">
      <FunctionField
        render={(org: V2OrganisationRead) => {
          const fundingProgrammes = org?.project_pitches
            // @ts-ignore
            ?.map(pitch => pitch.funding_programme)
            .filter(Boolean);

          if (!fundingProgrammes?.length) return "No programme assigned";
          return fundingProgrammes?.map((fund: LimitedFundingProgrammeRead) => {
            return (
              <Link
                key={fund.uuid}
                className="block"
                to={createPath({
                  resource: modules.fundingProgramme.ResourceName,
                  id: fund.uuid,
                  type: "show"
                })}
              >
                <UrlField record={fund} source="name" />
              </Link>
            );
          });
        }}
      />
    </ArrayField>
  );
};

export default FundingProgrammesArrayField;
