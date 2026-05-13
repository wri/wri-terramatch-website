import { Flex, FlexProps, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { FC, ReactNode } from "react";

import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

export interface PageItemProps {
  title: string;
  buttonProps?: IButtonProps;
  downloadButtonProps?: IButtonProps;
  children?: ReactNode;
  flexProps?: FlexProps;
  tag?: ReactNode;
  className?: string;
  multiActionButtonProps?: IMultiActionButtonProps;
}

const PageItem: FC<PageItemProps> = ({
  title,
  buttonProps = null,
  downloadButtonProps = null,
  children,
  flexProps,
  tag,
  className,
  multiActionButtonProps = null
}) => (
  <Flex direction="column" gap={4} flex={1} {...flexProps} className={classNames(className)}>
    <Flex
      alignItems="center"
      justifyContent="space-between"
      className="mobile:flex-col mobile:!items-start mobile:gap-2"
    >
      <div className="flex items-center gap-2">
        <Text color="primary.900" textStyle="600">
          {title}
        </Text>
        {tag !== null && tag}
      </div>
      <Flex gap={4} className="mobile:w-full mobile:justify-end">
        {downloadButtonProps !== null && <Button {...downloadButtonProps} />}
        {buttonProps !== null && <Button {...buttonProps} />}
        {multiActionButtonProps !== null && (
          <>
            <SimpleDivider className="!h-7 !w-[0.063rem]" />
            <MultiActionButton {...multiActionButtonProps} />
          </>
        )}
      </Flex>
    </Flex>
    {children}
  </Flex>
);

export default PageItem;
