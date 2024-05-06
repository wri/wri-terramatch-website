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
    <div className="relative flex h-screen w-full bg-square-pattern bg-contain bg-right bg-no-repeat">
      <div className="mt-[-78px] flex w-[45%] flex-col items-center justify-center py-[78px]">
        {children}
        <When condition={pathname !== "/sign-up"}>
          {/* <Button variant="transparent" className="self-start pt-4 pb-8 px-9 lg:px-14 lg:pb-10">
            <Text variant="text-12-bold" className="text-primary">
              English (United Kingdom)
            </Text>
          </Button> */}
          <div className="absolute bottom-[1.5vh] left-6">
            <Button>
              <Text variant="text-12-bold" className="text-primary">
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
