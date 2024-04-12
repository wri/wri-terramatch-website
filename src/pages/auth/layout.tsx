"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = props => {
  const { children } = props;
  const pathname = usePathname();

  return (
    <div className="relative flex h-screen w-screen bg-square-pattern bg-contain bg-right bg-no-repeat">
      <div className="flex w-[45%] flex-col items-center justify-between">
        <div className="flex w-full items-center justify-between px-9 pt-8 pb-4 lg:px-16 lg:pt-10">
          <Icon
            name={IconNames.WRI_LOGO}
            className="h-[30px] w-[108px] lg:h-[60px] lg:w-[138px] wide:h-[80px] wide:w-[158px]"
          />
          <div className="flex gap-1">
            <When condition={pathname == "/auth/signup"}>
              <Text variant="text-14-light" className="text-blue-700">
                Already have an account?{" "}
              </Text>
              <Link href="/login">
                <Text variant="text-14-bold" className="text-blue-300 underline">
                  Log in
                </Text>
              </Link>
            </When>
          </div>
        </div>
        {children}
        <When condition={pathname !== "/sign-up"}>
          {/* <Button variant="transparent" className="self-start px-9 pt-4 pb-8 lg:px-14 lg:pb-10">
            <Text variant="text-12-bold" className="text-blue-300">
              English (United Kingdom)
            </Text>
          </Button> */}
          <Button className="self-start px-9 pb-8 lg:px-14 lg:pb-10">
            <Text variant="text-12-bold" className="text-blue-300">
              English (United Kingdom)
            </Text>
          </Button>
        </When>
      </div>
      <div className="flex w-[55%] items-center justify-end" />
    </div>
  );
};

export default LoginLayout;
