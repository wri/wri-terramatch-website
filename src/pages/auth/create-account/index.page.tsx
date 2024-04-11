"use client";
import Link from "next/link";
import React, { useState } from "react";

import Button from "@/components/componentsToLogin/Button/Button";
import { BUTTON_VARIANT_BLUE } from "@/components/componentsToLogin/Button/ButtonVariant";
import Text from "@/components/componentsToLogin/Text/Text";

import LoginLayout from "../layout";
import { UserRolInfo } from "./MockedData";
import UserRoleCard from "./UserRoleCard";

const Page = () => {
  const [selected, setSelected] = useState<string>();
  return (
    <LoginLayout>
      <div className="mb-auto mt-auto w-[30vw]">
        <div className="mb-8 flex flex-col gap-2">
          <Text variant="text-32-bold" className="text-blue-700">
            Create an account
          </Text>
          <Text variant="text-12-light" className="text-blue-700">
            Create new account TerraMatch’s Pulse
          </Text>
        </div>
        <div className="mb-6 flex flex-col gap-2 lg:gap-3">
          {UserRolInfo.map(item => (
            <Button key={item.id} onClick={() => setSelected(item.id)}>
              <UserRoleCard selected={selected == item.id} title={item.title} description={item.description} />
            </Button>
          ))}
        </div>
        <Link href={"/auth/signup"}>
          <Button variant={BUTTON_VARIANT_BLUE}>Continue</Button>
        </Link>
      </div>
    </LoginLayout>
  );
};

export default Page;
