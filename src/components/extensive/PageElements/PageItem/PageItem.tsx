import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";

export interface PageItemProps {
  title: string;
  buttonProps?: IButtonProps;
  downloadButtonProps?: IButtonProps;
  children?: ReactNode;
  flexProps?: FlexProps;
  tag?: ReactNode;
  className?: string;
}

const PageItem: FC<PageItemProps> = ({
  title,
  buttonProps = null,
  downloadButtonProps = null,
  children,
  flexProps,
  tag,
  className
}) => (
  <Flex direction="column" gap={4} flex={1} {...flexProps} className={className}>
    <Flex alignItems="center" justifyContent="space-between">
      <div className="flex items-center gap-2">
        <Text color="primary.900" textStyle="600">
          {title}
        </Text>
        {tag !== null && tag}
      </div>
      <Flex gap={4}>
        {downloadButtonProps !== null && <Button {...downloadButtonProps} />}
        {buttonProps !== null && <Button {...buttonProps} />}
      </Flex>
    </Flex>
    {children}
  </Flex>
);

export default PageItem;
