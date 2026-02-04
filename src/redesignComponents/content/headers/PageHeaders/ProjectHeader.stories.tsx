import { Meta, StoryObj } from "@storybook/react";

import { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

import { ProfileImageProps } from "../../Images/ProfileImage/ProfileImage";
import ProjectHeader from "./ProjectHeader";

const meta: Meta<typeof ProjectHeader> = {
  title: "Redesign Components/Content/Headers/Project Header",
  component: ProjectHeader,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The project title"
    },
    image: {
      control: "object",
      description: "Profile image configuration for the project"
    },
    tag: {
      control: "object",
      description: "Progress tag configuration with state"
    },
    organization: {
      control: "text",
      description: "The organization name"
    },
    description: {
      control: "text",
      description: "Project description"
    },
    startDate: {
      control: "text",
      description: "Project start date"
    },
    endDate: {
      control: "text",
      description: "Project end date"
    },
    country: {
      control: "text",
      description: "Project country"
    },
    team: {
      control: "object",
      description: "Team information with name and avatar"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ProjectHeader>;

export const Default: Story = {
  args: {
    title: "Project Name",
    image: {
      src: "https://i.pravatar.cc/300?img=4",
      alt: "Project Image",
      size: 164
    } as ProfileImageProps,
    tag: {
      state: "in-progress"
    } as ProgressTagProps,
    organization: "Organisation Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "mm/yyyy",
    endDate: "mm/yyyy",
    countryFlag: "🇪🇹",
    country: "Ethiopia",
    team: [
      {
        name: "John Doe",
        avatar: {
          name: "John Doe",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=1"
        } as AvatarProps
      }
    ]
  }
};

/**
 * Project header with not-started progress tag
 */
export const NotStarted: Story = {
  args: {
    title: "Project Name",
    image: {
      src: "https://i.pravatar.cc/300?img=5",
      alt: "Project Image",
      size: 164
    } as ProfileImageProps,
    tag: {
      state: "not-started"
    } as ProgressTagProps,
    organization: "Organisation Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "mm/yyyy",
    endDate: "mm/yyyy",
    country: "Kenya",
    countryFlag: "🇰🇪",
    team: [
      {
        name: "Jane Smith",
        avatar: {
          name: "Jane Smith",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=2"
        } as AvatarProps
      }
    ]
  }
};

/**
 * Project header with in-progress tag
 */
export const InProgress: Story = {
  args: {
    title: "Project Name",
    image: {
      src: "https://i.pravatar.cc/300?img=1",
      alt: "Project Image",
      size: 164
    } as ProfileImageProps,
    tag: {
      state: "in-progress"
    } as ProgressTagProps,
    organization: "Organisation Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "mm/yyyy",
    endDate: "mm/yyyy",
    country: "India",
    countryFlag: "🇮🇳",
    team: [
      {
        name: "Michael Chen",
        avatar: {
          name: "Michael Chen",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=3"
        } as AvatarProps
      },
      {
        name: "Michael Chen",
        avatar: {
          name: "Michael Chen",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=1"
        } as AvatarProps
      },
      {
        name: "Team Lead",
        avatar: { name: "Team Lead", size: "medium" } as AvatarProps
      },
      {
        name: "Michael Chen",
        avatar: {
          name: "Michael Chen",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=2"
        } as AvatarProps
      },
      {
        name: "Team Member",
        avatar: { name: "Team Member", size: "medium" } as AvatarProps
      }
    ]
  }
};

/**
 * Project header with complete progress tag
 */
export const Complete: Story = {
  args: {
    title: "Project Name",
    image: {
      src: "https://i.pravatar.cc/300?img=7",
      alt: "Project Image",
      size: 164
    } as ProfileImageProps,
    tag: {
      state: "complete"
    } as ProgressTagProps,
    organization: "Organisation Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "mm/yyyy",
    endDate: "mm/yyyy",
    country: "Bangladesh",
    countryFlag: "🇧🇩",
    team: [
      {
        name: "Sarah Johnson",
        avatar: {
          name: "Sarah Johnson",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=4"
        } as AvatarProps
      }
    ]
  }
};

/**
 * Project header without image
 */
export const WithoutImage: Story = {
  args: {
    title: "Project Name",
    tag: {
      state: "in-progress"
    } as ProgressTagProps,
    organization: "Organisation Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "mm/yyyy",
    endDate: "mm/yyyy",
    country: "Philippines",
    countryFlag: "🇵🇭",
    team: [
      {
        name: "David Martinez",
        avatar: {
          name: "David Martinez",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=5"
        } as AvatarProps
      }
    ]
  }
};

/**
 * Project header without description
 */
export const WithoutDescription: Story = {
  args: {
    title: "Project Name",
    image: {
      src: "https://i.pravatar.cc/300?img=8",
      alt: "Project Image",
      size: 164
    } as ProfileImageProps,
    tag: {
      state: "in-progress"
    } as ProgressTagProps,
    organization: "Organisation Name",
    startDate: "mm/yyyy",
    endDate: "mm/yyyy",
    country: "Costa Rica",
    countryFlag: "🇨🇷",
    team: [
      {
        name: "Alex Thompson",
        avatar: {
          name: "Alex Thompson",
          size: "medium",
          src: "https://i.pravatar.cc/300?img=9"
        } as AvatarProps
      }
    ]
  }
};

/**
 * Project header without team
 */
export const WithoutTeam: Story = {
  args: {
    title: "Project Name",
    image: {
      src: "https://i.pravatar.cc/300?img=10",
      alt: "Project Image",
      size: 164
    } as ProfileImageProps,
    tag: {
      state: "in-progress"
    } as ProgressTagProps,
    organization: "Organisation Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "2024-04-01",
    endDate: "2026-03-31",
    country: "Ghana",
    countryFlag: "🇬🇭"
  }
};

/**
 * All progress tag states comparison
 */
export const AllProgressStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ProjectHeader
        title="Project Name"
        tag={{ state: "not-started" } as ProgressTagProps}
        organization="Organisation Name"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        startDate="2025-01-01"
        endDate="2026-12-31"
        countryFlag="🇺🇸"
        country="USA"
        team={[
          {
            name: "Team Lead",
            avatar: { name: "Team Lead", size: "medium" } as AvatarProps
          }
        ]}
      />
      <ProjectHeader
        title="Project Name"
        tag={{ state: "in-progress" } as ProgressTagProps}
        organization="Organisation Name"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        startDate="2024-01-01"
        endDate="2025-12-31"
        countryFlag="🇨🇦"
        country="Canada"
        team={[
          {
            name: "Team Lead",
            avatar: { name: "Team Lead", size: "medium" } as AvatarProps
          }
        ]}
      />
      <ProjectHeader
        title="Project Name"
        tag={{ state: "complete" } as ProgressTagProps}
        organization="Organisation Name"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        startDate="2022-01-01"
        endDate="2023-12-31"
        countryFlag="🇲🇽"
        country="Mexico"
        team={[
          {
            name: "Team Lead",
            avatar: { name: "Team Lead", size: "medium" } as AvatarProps
          }
        ]}
      />
    </div>
  )
};
