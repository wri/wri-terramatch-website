import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";

export type BuildStrongerProfileStep = {
  showWhen: boolean;
  title: string;
  subtitle: string;
};

type BuildStrongerProfileProps = {
  subtitle: string;
  steps: BuildStrongerProfileStep[];
  onEdit: () => void;
};

const BuildStrongerProfile = ({ subtitle, steps, onEdit }: BuildStrongerProfileProps) => {
  const t = useT();

  return (
    <section className="my-10 rounded-lg bg-neutral-150  p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Text variant="text-heading-2000">{t("Build a Stronger Profile")}</Text>
          <Button onClick={onEdit}>{t("Edit Profile")}</Button>
        </div>
        <Text variant="text-body-800">{subtitle}</Text>
        <div className="mt-10 mb-4">
          <Text variant="text-heading-300">{t("Adding these items would make your profile stronger:")}</Text>
        </div>
        <List
          items={steps}
          render={step => (
            <When condition={step.showWhen}>
              <div className="mb-6 flex flex-col justify-between gap-2 rounded-xl bg-white p-4 pr-6 shadow">
                <Text variant="text-heading-200">{step.title}</Text>
                <Text variant="text-body-600">{step.subtitle}</Text>
              </div>
            </When>
          )}
        />
      </div>
    </section>
  );
};

export default BuildStrongerProfile;
