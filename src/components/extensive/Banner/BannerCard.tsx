import { PropsWithChildren } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Container from "@/components/generic/Layout/Container";

import Text from "../../elements/Text/Text";
import Icon, { IconProps } from "../Icon/Icon";

export type BannerCardProps = {
  title?: string;
  subtitle?: string;
  buttonProps?: IButtonProps;
  iconProps?: IconProps;
};

const BannerCard = (props: PropsWithChildren<BannerCardProps>) => {
  return (
    <Container className="flex justify-end">
      <div className="w-[420px] rounded-sm bg-white">
        <div className="flex gap-4 p-4">
          <When condition={!!props.iconProps}>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-150">
              <Icon {...props.iconProps!} />
            </div>
          </When>
          <div className="flex flex-1 flex-col gap-1">
            <When condition={props.title}>
              <Text variant="text-body-900">{props.title}</Text>
            </When>
            <When condition={props.subtitle}>
              <Text variant="text-body-800">{props.subtitle}</Text>
            </When>
            {props.children}
          </div>
        </div>
        <When condition={!!props.buttonProps}>
          <div className="bg-neutral-150 p-4">
            <Button fullWidth {...props.buttonProps!} />
          </div>
        </When>
      </div>
    </Container>
  );
};

export default BannerCard;
