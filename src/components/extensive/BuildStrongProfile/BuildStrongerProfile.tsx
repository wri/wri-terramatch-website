import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";

export type BuildStrongerProfileStep = {
  title: string;
  subtitle: string;
  visible: boolean;
};

type BuildStrongerProfileProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  backgroundColor: "white" | "bg-neutral-150";
  title: string;
  subtitle: string;
  listTitle: string;
  steps: BuildStrongerProfileStep[];
  ctaProps: IButtonProps;
};

const BuildStrongerProfile: FC<BuildStrongerProfileProps> = ({
  title,
  subtitle,
  listTitle,
  backgroundColor,
  steps,
  ctaProps,
  className,
  ...sectionProps
}) => (
  <section {...sectionProps} className={classNames("my-10 p-8", backgroundColor, className)}>
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <Text variant="text-heading-700" className="mb-4.5">
          {title}
        </Text>
        <Button {...ctaProps} />
      </div>

      <Text variant="text-heading-100" className="mb-15">
        {subtitle}
      </Text>

      <Text variant="text-heading-300" className="mb-8">
        {listTitle}
      </Text>

      <List
        items={steps}
        className="space-y-8"
        render={step =>
          !step.visible ? null : (
            <div className="flex flex-col justify-between gap-2 rounded-xl bg-white py-5 px-4 shadow">
              <Text variant="text-heading-200">{step.title}</Text>
              <Text variant="text-body-600">{step.subtitle}</Text>
            </div>
          )
        }
      />
    </div>
  </section>
);

export default BuildStrongerProfile;
