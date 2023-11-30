import { useT } from "@transifex/react";
import _ from "lodash";
import { useMemo } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Container from "@/components/generic/Layout/Container";
import { useModalContext } from "@/context/modal.provider";
import { V2FileRead, V2OrganisationRead } from "@/generated/apiSchemas";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";
import Files from "../Files";
import FinancialInformation from "./FinancialInformation";

type FinancialTabContentProps = {
  organization?: V2OrganisationRead;
};

const FinancialTabContent = ({ organization }: FinancialTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    const financial = _.pick<any, keyof V2OrganisationRead>(organization, [
      "fin_budget_current_year",
      "fin_budget_3year",
      "fin_budget_2year",
      "fin_budget_1year"
    ]);

    const statementFiles = _.pick<any, keyof V2OrganisationRead>(
      organization,
      // @ts-ignore
      ["op_budget_3year", "op_budget_2year", "op_budget_1year"]
    );

    return {
      financial: _.some(financial, _.isNull || _.isNaN),
      statementFiles: _.some(statementFiles, _.isEmpty)
    };
  }, [organization]);

  const showIncompleteStepsSection = _.values(incompleteSteps).includes(true);

  const files: V2FileRead[] = useMemo(() => {
    return [
      // @ts-ignore
      ...(organization?.op_budget_3year ?? []),
      ...(organization?.op_budget_2year ?? []),
      // @ts-ignore
      ...(organization?.op_budget_1year ?? [])
    ];
  }, [organization]);

  return (
    <Container className="py-15">
      <Text variant="text-heading-2000">{t("Financial Information")}</Text>

      {/* Information */}
      <When condition={!incompleteSteps.financial}>
        <FinancialInformation organization={organization} />
      </When>
      {/* Files */}
      <When condition={!incompleteSteps.statementFiles}>
        <Files files={files} />
      </When>
      {/* Build a Stronger Profile */}
      <When condition={showIncompleteStepsSection}>
        <BuildStrongerProfile
          steps={[
            {
              showWhen: incompleteSteps.financial,
              title: t("Add Organizational Budget"),
              subtitle: t(
                "Note that the budget denotes the amount of money managed by your organization in the given year, converted into USD."
              )
            },
            {
              showWhen: incompleteSteps.statementFiles,
              title: t("Add Financial Documents"),
              subtitle: t(
                "Note that your organisation's financial documents denotes the amount of money managed by your organization in the given year, converted into USD."
              )
            }
          ]}
          subtitle={t(
            "Organizational Profiles with financial information are more likely to be successful in Funding Applications."
          )}
          onEdit={() => openModal(<OrganizationEditModal organization={organization} />)}
        />
      </When>
    </Container>
  );
};

export default FinancialTabContent;
