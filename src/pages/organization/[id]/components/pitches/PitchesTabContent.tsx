import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PitchesTable from "@/components/extensive/Tables/PitchesTable";
import Container from "@/components/generic/Layout/Container";
import { useGetV2ProjectPitches } from "@/generated/apiComponents";

const PitchesTabContent = () => {
  const t = useT();
  const orgUUID = useRouter().query.id as string;
  const { data: pitches } = useGetV2ProjectPitches(
    {
      queryParams: {
        page: 1,
        per_page: 5,
        //@ts-ignore
        "filter[organisation_id]": orgUUID
      }
    },
    {
      enabled: !!orgUUID
    }
  );

  if (!orgUUID) return null;

  return (
    <Container className="px-8 py-15">
      <If
        condition={
          //@ts-ignore
          pitches?.meta?.total > 0
        }
      >
        <Then>
          <div className="mb-8 flex">
            <Text variant="text-heading-1000" className="flex-1">
              {t("Pitches")}
            </Text>
            <Button as={Link} href={`/organization/${orgUUID}/project-pitch/create/intro`}>
              {t("Create project pitch")}
            </Button>
          </div>
          <div className="rounded-xl p-8 shadow">
            <PitchesTable organisationUUID={orgUUID} />
          </div>
        </Then>
        <Else>
          <EmptyState
            title={t("Create a pitch")}
            subtitle={t(
              "Your organization currently does not have any available pitches. To apply for funding opportunities, you need to create a pitch. By creating a pitch, you will have a ready-to-use resource for funding opportunities."
            )}
            iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
            ctaProps={{
              as: Link,
              href: `/organization/${orgUUID}/project-pitch/create/intro`,
              children: t("Create Pitch")
            }}
          />
        </Else>
      </If>
    </Container>
  );
};

export default PitchesTabContent;
