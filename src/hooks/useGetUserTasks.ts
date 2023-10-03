import { useT } from "@transifex/react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import { TaskListItem } from "@/components/extensive/TaskList/TaskList";
import { useGetV2ProjectPitches } from "@/generated/apiComponents";
import { orgProfileCompletionStatus } from "@/helpers/organisation";

import { useDate } from "./useDate";
import { useMyOrg } from "./useMyOrg";
import { usePitchStatus } from "./usePitchStatus";

export const useGetUserTasks = () => {
  const t = useT();
  const myOrg = useMyOrg();
  const { format } = useDate();
  const { status, progress } = orgProfileCompletionStatus(myOrg);
  const { data: pitches } = useGetV2ProjectPitches(
    {
      queryParams: {
        page: 1,
        per_page: 1000,
        //@ts-ignore
        "filter[organisation_id]": myOrg?.uuid
      }
    },
    {
      enabled: !!myOrg?.uuid
    }
  );
  const pitchesStatus = usePitchStatus(pitches?.data);

  const orgTaskMapping: { [index: string]: TaskListItem } = {
    empty: {
      title: t("Complete organizational profile for {orgName}", { orgName: myOrg?.name }),
      subtitle: t("While your organization is being reviewed by WRI, complete your organizational profile."),
      actionText: t("Complete org"),
      actionUrl: "/organization/assign",
      iconProps: {
        name: IconNames.BRANCH_CIRCLE,
        className: "fill-success"
      }
    },
    incomplete: {
      title: t("Continue adding organizational profile information for {orgName}", { orgName: myOrg?.name }),
      subtitle: t("You have completed {progress} of your profile. Your last edit was {lastEdit}", {
        progress: `${progress}%`,
        lastEdit: format(myOrg?.updated_at)
      }),
      actionText: t("Continue"),
      actionUrl: `/organization/${myOrg?.uuid}?modal=edit`,
      iconProps: {
        name: IconNames.BRANCH_CIRCLE,
        className: "fill-success"
      }
    },
    complete: {
      title: t("Review organizational profile for {orgName}", { orgName: myOrg?.name }),
      subtitle: t("Keep your profile updated to have more chances of having a successful application."),
      actionText: t("View"),
      actionUrl: `/organization/${myOrg?.uuid}`,
      iconProps: {
        name: IconNames.BRANCH_CIRCLE,
        className: "fill-success"
      },
      done: true
    }
  };

  const pitchTaskMapping: { [index: string]: TaskListItem } = {
    empty: {
      title: t("Create a Pitch"),
      subtitle: t(
        "While your organization is being reviewed by WRI, create a project pitch by clicking the “Create Pitch” button"
      ),
      actionText: t("Create Pitch"),
      actionUrl: `organization/${myOrg?.uuid}/project-pitch/create/intro`,
      iconProps: {
        name: IconNames.LIGHT_BULB_CIRCLE,
        className: "fill-success"
      }
    },
    incomplete: {
      title: t("Continue adding information for your pitches"),
      subtitle: t("You have <strong class='text-body-500'>1 or more</strong> pitches that need to be completed"),
      actionText: t("Continue"),
      actionUrl: `/organization/${myOrg?.uuid}?tab=pitches`,
      iconProps: {
        name: IconNames.LIGHT_BULB_CIRCLE,
        className: "fill-success"
      }
    },
    complete: {
      title:
        pitches?.data?.length === 1
          ? t("Review pitch information for {pitchName}", {
              pitchName: pitches?.data[0].project_name || ""
            })
          : t("Review pitch information for your pitches ({count})", { count: pitches?.data?.length }),

      subtitle: t(
        "You can use your pitches to apply for funding opportunities and more, you can create more pitches in your organization pitches page."
      ),
      actionText: t(pitches?.data?.length === 1 ? t("View") : t("View pitches")),
      actionUrl:
        pitches?.data?.length === 1
          ? `/project-pitches/${pitches?.data[0].uuid}`
          : `/organization/${myOrg?.uuid}?tab=pitches`,
      iconProps: {
        name: IconNames.LIGHT_BULB_CIRCLE,
        className: "fill-success"
      },
      done: true
    }
  };

  return [orgTaskMapping[status], pitchTaskMapping[pitchesStatus]];
};
