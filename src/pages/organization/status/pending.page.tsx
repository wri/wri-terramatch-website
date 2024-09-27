import { useT } from "@transifex/react";
import Image from "next/image";
import HandsPlantingImage from "public/images/hands-planting.webp";

import Text from "@/components/elements/Text/Text";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { myOrganisationConnection } from "@/connections/Organisation";
import { useConnection } from "@/hooks/useConnection";

const OrganizationPendingPage = () => {
  const t = useT();
  const [, { organisation }] = useConnection(myOrganisationConnection);

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white py-15">
          <Image src={HandsPlantingImage} alt="Hands Planting" width={550} height={379} placeholder="blur" />
          <Text variant="text-heading-700" className="text-center">
            {t("Your request to join this organization is being reviewed")}
          </Text>
          <div className="px-16">
            <Text variant="text-body-1000" className="text-center">
              {t(
                "You'll receive an email confirmation when your request has been approved. Ask a member of your organization ({organizationName}) to approve your request.",
                { organizationName: organisation?.name }
              )}
            </Text>
          </div>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default OrganizationPendingPage;
