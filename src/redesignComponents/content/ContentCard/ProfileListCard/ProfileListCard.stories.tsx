import { Box } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { FC } from "react";

import ProfileListCard, { IProfile } from "./ProfileListCard";

const meta: Meta<typeof ProfileListCard> = {
  title: "Redesign Components/Content/Content Card/Profile List Card",
  component: ProfileListCard,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array of profile list card items, each with title, profiles, and onProfileClick"
    }
  }
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

const StoryWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
    padding={8}
    backgroundColor="neutral.200"
  >
    {children}
  </Box>
);

/**
 * Default profile list card with multiple profiles
 */
export const Default: Story = {
  render: () => (
    <StoryWrapper>
      <ProfileListCard
        items={[
          {
            title: "Header Label",
            profiles: sampleProfiles,
            onProfileClick: profile => {
              console.log("Profile clicked:", profile);
            }
          }
        ]}
      />
    </StoryWrapper>
  )
};

/**
 * Profile list card with a single profile
 */
export const SingleProfile: Story = {
  render: () => (
    <StoryWrapper>
      <ProfileListCard
        items={[
          {
            title: "Header Label",
            profiles: [
              {
                id: "1",
                name: "Name Surname",
                image: "https://i.pravatar.cc/300?img=1"
              }
            ],
            onProfileClick: profile => {
              console.log("Profile clicked:", profile);
            }
          }
        ]}
      />
    </StoryWrapper>
  )
};

/**
 * Profile list card with many profiles
 */
export const ManyProfiles: Story = {
  render: () => (
    <StoryWrapper>
      <ProfileListCard
        items={[
          {
            title: "Header Label",
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
            onProfileClick: profile => {
              console.log("Profile clicked:", profile);
            }
          }
        ]}
      />
    </StoryWrapper>
  )
};

/**
 * Profile list card with profiles without images (showing initials)
 */
export const ProfilesWithoutImages: Story = {
  render: () => (
    <StoryWrapper>
      <ProfileListCard
        items={[
          {
            title: "Header Label",
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
            onProfileClick: profile => {
              console.log("Profile clicked:", profile);
            }
          }
        ]}
      />
    </StoryWrapper>
  )
};

/**
 * Profile list card with no profiles (empty state)
 */
export const NoData: Story = {
  render: () => (
    <StoryWrapper>
      <ProfileListCard
        items={[
          {
            title: "Header Label",
            profiles: [],
            onProfileClick: profile => {
              console.log("Profile clicked:", profile);
            }
          }
        ]}
      />
    </StoryWrapper>
  )
};
