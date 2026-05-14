import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { OrganisationLightDto } from "@/generated/v3/userService/userServiceSchemas";

import { useOrganizationCreateContext } from "../context/OrganizationCreate.provider";
import OrganizationSelectRow from "./OrganizationSelectRow";

type OrganizationCreatePanelProps = {
  loading: boolean;
  searchedTerm: string;
  organizations: OrganisationLightDto[];
};

const OrganizationAssignPanel: FC<OrganizationCreatePanelProps> = ({ loading, searchedTerm, organizations }) => {
  const t = useT();
  const { setType } = useOrganizationCreateContext();

  return (
    <section className="w-full rounded-lg border border-solid border-neutral-400 px-6 pb-6">
      {/* Loader */}
      {loading ? (
        <div className="flex h-20 items-center justify-center pt-6">
          <Text variant="text-body-600">{t("Loading...")}</Text>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {organizations.length === 0 ? (
            <Text variant="text-body-500" className="mt-6">
              {t(`No existing organizations found for "{searchedTerm}"`, { searchedTerm })}
            </Text>
          ) : (
            <>
              <Text variant="text-body-500" className="mt-6 mb-2">
                {t(`{number} existing organizations found for "{searchedTerm}"`, {
                  searchedTerm,
                  number: organizations.length
                })}
              </Text>
              {/* Organizations List */}
              <List
                items={organizations}
                render={organization => <OrganizationSelectRow organization={organization} />}
                className="h-[250px] overflow-y-auto px-4"
              />
            </>
          )}

          <Button
            className="mt-8"
            onClick={() => setType("create")}
            iconProps={{ name: IconNames.PLUS_THICK, width: 12 }}
            variant="secondary"
          >
            {t(`Create new organization: "{searchedTerm}"`, { searchedTerm })}
          </Button>
        </>
      )}
    </section>
  );
};

export default OrganizationAssignPanel;
