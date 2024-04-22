"use client";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = props => {
  const { children } = props;
  const pathname = usePathname();

  return (
    <div className="relative flex h-full w-full bg-square-pattern bg-contain bg-right bg-no-repeat">
      <div className="flex w-[45%] flex-col items-center justify-between pt-9">
        {children}
        <When condition={pathname !== "/sign-up"}>
          {/* <Button variant="transparent" className="self-start pt-4 pb-8 px-9 lg:px-14 lg:pb-10">
            <Text variant="text-12-bold" className="text-blue-300">
              English (United Kingdom)
            </Text>
          </Button> */}
          <div className="self-start px-9 py-2 lg:px-14">
            <Button>
              <Text variant="text-12-bold" className="text-blue-300">
                English (United Kingdom)
              </Text>
            </Button>
          </div>
        </When>
      </div>
      <div className="flex w-[55%] items-center justify-end" />
    </div>
  );
};

export default LoginLayout;
