import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import TextRow from "@/components/extensive/TextRow/TextRow";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";

type AboutProps = {
  organization?: OrganisationFullDto;
};

const About = ({ organization }: AboutProps) => {
  const t = useT();

  return (
    <section className="my-15 rounded-lg bg-neutral-150 p-8">
      <div className="flex flex-col gap-4">
        <Text variant="text-heading-300">{t("About")}</Text>
        <Text variant="text-body-800">{organization?.description}</Text>
      </div>
      <div className="mt-10 flex flex-col gap-4">
        <TextRow name={t("Website:")} value={organization?.webUrl ?? undefined} nameClassName="w-1/3" />
        <TextRow
          name={t("Headquarters:")}
          value={`${organization?.hqCity ?? ""}, ${organization?.hqCountry ?? ""}`}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Organization phone number:")}
          value={organization?.phone ?? undefined}
          nameClassName="w-1/3"
        />
      </div>
    </section>
  );
};

export default About;
