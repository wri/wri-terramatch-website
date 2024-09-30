import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

export interface UpcomingOpportunitiesCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  buttonText: string;
  buttonLink: string;
}

const UpcomingOpportunitiesCard = (props: UpcomingOpportunitiesCardProps) => {
  const { title, buttonLink, buttonText, className, ...rest } = props;
  const t = useT();

  return (
    <div
      {...rest}
      className={classNames(
        "relative flex h-[178px] w-[308px] flex-col items-start justify-end gap-4 bg-cover bg-no-repeat px-7 py-4",
        className
      )}
    >
      <Text variant="text-body-500" className="absolute right-4 top-2 text-white">
        {t("Support")}
      </Text>
      <Text variant="text-heading-300" className="text-white">
        {title}
      </Text>
      <Button as={Link} variant="secondary" href={buttonLink}>
        {buttonText}
      </Button>
    </div>
  );
};

export default UpcomingOpportunitiesCard;
