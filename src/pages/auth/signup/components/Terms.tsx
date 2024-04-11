import Link from "next/link";
import React from "react";

import Checkbox from "@/components/componentsToLogin/Checkbox/Checkbox";
import Text from "@/components/componentsToLogin/Text/Text";

const Terms: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Checkbox
        keyCkeckbox="1"
        label={
          <div className="flex gap-1">
            <Text variant="text-12-light" className="text-blue-700">
              I agree to the{" "}
            </Text>
            <Link href="/login">
              <Text variant="text-12-bold" className="text-blue-300 underline">
                Terms of Service
              </Text>
            </Link>
            <Text variant="text-12-light" className="text-blue-700">
              and{" "}
            </Text>
            <Link href="/login">
              <Text variant="text-12-bold" className="text-blue-300 underline">
                Privacy Policy
              </Text>
            </Link>
          </div>
        }
      />
      <Checkbox
        keyCkeckbox="2"
        label={
          <Text variant="text-12-light" className="max-w-[90%] text-blue-700">
            I consent to my contact information being shared with other users via terramatch for the purposes of
            connecting with interested parties.
          </Text>
        }
      />
    </div>
  );
};

export default Terms;
