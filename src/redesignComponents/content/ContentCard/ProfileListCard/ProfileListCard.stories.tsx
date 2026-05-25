import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { TranslatedText } from "@/i18n/types";

import ProfileListCard, { IProfile } from "./ProfileListCard";

const meta: Meta<typeof ProfileListCard> = {
  title: "Redesign Components/Content/Content Card/Profile List Card",
  component: ProfileListCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#FFFFFF" },
        { name: "gray", value: "#F5F5F5" }
      ]
    }
  },
  argTypes: {
    items: {
      control: "object",
      description:
        "Array of profile list card items — each item supports: title, profiles (IProfile[]), onProfileClick, onInviteClick"
    },
    onInviteClick: {
      action: "inviteClick",
      description: "Callback fired when the invite CTA is clicked in any empty section"
    }
  },
  decorators: [
    Story => (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="25rem"
        padding={8}
        backgroundColor="neutral.200"
      >
        <Story />
      </Box>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ProfileListCard>;

const sampleProfiles: IProfile[] = [
  {
    id: "1",
    name: "Name Surname",
    image: "https://i.pravatar.cc/300?img=1"
  },
  {
    id: "2",
    name: "Name Surname",
    image: "https://i.pravatar.cc/300?img=2"
  },
  {
    id: "3",
    name: "Name Surname",
    image: "https://i.pravatar.cc/300?img=3"
  },
  {
    id: "4",
    name: "Name Surname",
    image: "https://i.pravatar.cc/300?img=4"
  }
];

/**
 * Default profile list card with multiple profiles
 */
export const Default: Story = {
  args: {
    onInviteClick: () => {},
    items: [
      {
        title: "Header Label" as TranslatedText,
        profiles: sampleProfiles.map((profile, index) =>
          index === 0
            ? {
                ...profile,
                email: "name.surname@email.org",
                isProjectManager: true
              }
            : profile
        ),
        onProfileClick: () => {}
      }
    ]
  }
};

/**
 * Profile list card with a single profile
 */
export const SingleProfile: Story = {
  args: {
    onInviteClick: () => {},
    items: [
      {
        title: "Header Label" as TranslatedText,
        profiles: [
          {
            id: "1",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=1"
          }
        ],
        onProfileClick: () => {}
      }
    ]
  }
};

/**
 * Profile list card with many profiles
 */
export const ManyProfiles: Story = {
  args: {
    onInviteClick: () => {},
    items: [
      {
        title: "Header Label" as TranslatedText,
        profiles: [
          {
            id: "1",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=1"
          },
          {
            id: "2",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=2"
          },
          {
            id: "3",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=3"
          },
          {
            id: "4",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=4"
          },
          {
            id: "5",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=5"
          },
          {
            id: "6",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=6"
          },
          {
            id: "7",
            name: "Name Surname",
            image: "https://i.pravatar.cc/300?img=7"
          }
        ],
        onProfileClick: () => {}
      }
    ]
  }
};

/**
 * Profile list card with profiles without images (showing initials)
 */
export const ProfilesWithoutImages: Story = {
  args: {
    onInviteClick: () => {},
    items: [
      {
        title: "Header Label" as TranslatedText,
        profiles: [
          {
            id: "1",
            name: "Alice Cooper",
            image: ""
          },
          {
            id: "2",
            name: "Bob Marley",
            image: ""
          },
          {
            id: "3",
            name: "Charlie Brown",
            image: ""
          }
        ],
        onProfileClick: () => {}
      }
    ]
  }
};

/**
 * Profile list card with no profiles (empty state)
 */
export const NoData: Story = {
  args: {
    onInviteClick: () => {},
    items: [
      {
        title: "Header Label" as TranslatedText,
        profiles: [],
        onProfileClick: () => {}
      }
    ]
  }
};
