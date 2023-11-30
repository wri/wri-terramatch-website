import { useT } from "@transifex/react";
import { getYear } from "date-fns";

import List from "@/components/extensive/List/List";
import TextRow from "@/components/extensive/TextRow/TextRow";
import { V2OrganisationRead } from "@/generated/apiSchemas";

type FinancialInformationProps = {
  organization?: V2OrganisationRead;
};

const FinancialInformation = ({ organization }: FinancialInformationProps) => {
  const t = useT();

  const currentYear = getYear(new Date());

  const budgetRows = [
    { dates: `${currentYear} - ${currentYear + 1}`, value: `${organization?.fin_budget_current_year} USD` },
    { dates: `${currentYear - 1} - ${currentYear}`, value: `${organization?.fin_budget_1year} USD` },
    { dates: `${currentYear - 2} - ${currentYear - 1}`, value: `${organization?.fin_budget_2year} USD` },
    { dates: `${currentYear - 3} - ${currentYear - 2}`, value: `${organization?.fin_budget_3year} USD` }
  ];

  return (
    <section className="my-10 bg-neutral-150 p-8">
      <List
        className="flex flex-col gap-3"
        items={budgetRows}
        render={row => (
          <TextRow
            name={t("Organization Budget in USD for {dates}:", { dates: row.dates })}
            value={row.value}
            nameClassName="w-1/3"
          />
        )}
      />
    </section>
  );
};

export default FinancialInformation;
