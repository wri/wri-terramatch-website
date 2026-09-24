import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { type FC, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface NoResultsProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

const NoResults: FC<NoResultsProps> = ({ title, description, className, ...props }) => (
  <div {...props} className={twMerge(classNames("flex flex-col gap-2", className))}>
    <Text textStyle="600-bold" color="neutral.900">
      {title}
    </Text>
    <Text textStyle="400" color="neutral.800">
      {description}
    </Text>
  </div>
);

export default NoResults;
