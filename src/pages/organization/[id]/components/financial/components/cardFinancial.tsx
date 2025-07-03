import { ReactNode } from "react";

import Text from "@/components/elements/Text/Text";
type CardFinancialProps = {
  title: string;
  data: string | ReactNode;
  description: string;
};

const CardFinancial = ({ title, data, description }: CardFinancialProps) => {
  return (
    <div className="flex flex-col justify-center gap-1 rounded-lg p-5 shadow-all">
      <Text variant="text-16-bold" className="text-blueCustom-900">
        {title}
      </Text>
      <Text variant="text-40-bold" className="text-blueCustom">
        {data}
      </Text>
      <Text variant="text-16-light" className="text-blueCustom-900">
        {description}
      </Text>
    </div>
  );
};

export default CardFinancial;
