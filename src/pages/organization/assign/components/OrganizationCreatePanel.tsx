import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { V2GenericList } from "@/generated/apiSchemas";

import { useOrganizationCreateContext } from "../context/OrganizationCreate.provider";
import OrganizationSelectRow from "./OrganizationSelectRow";

type OrganizationCreatePanelProps = {
  loading: boolean;
  searchedTerm: string;
  organizations: V2GenericList[];
};

const OrganizationAssignPanel = ({ loading, searchedTerm, organizations }: OrganizationCreatePanelProps) => {
  const t = useT();
  const { setType } = useOrganizationCreateContext();

  return (
    <section className="w-full rounded-lg border border-solid border-neutral-400 px-6 pb-6">
      {/* Loader */}
      <If condition={loading}>
        <Then>
          <div className="flex h-20 items-center justify-center pt-6">
            <Text variant="text-body-600">{t("Loading...")}</Text>
          </div>
        </Then>
        <Else>
          {/* Empty State */}
          <If condition={organizations.length === 0}>
            <Then>
              <Text variant="text-body-500" className="mt-6">
                {t(`No existing organizations found for "{searchedTerm}"`, { searchedTerm })}
              </Text>
            </Then>
            <Else>
              <Text variant="text-body-500" className="mb-2 mt-6">
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
            </Else>
          </If>

          <Button
            className="mt-8"
            onClick={() => setType("create")}
            iconProps={{ name: IconNames.PLUS_THICK, width: 12 }}
            variant="secondary"
          >
            {t(`Create new organization: "{searchedTerm}"`, { searchedTerm })}
          </Button>
        </Else>
      </If>
    </section>
  );
};

export default OrganizationAssignPanel;
