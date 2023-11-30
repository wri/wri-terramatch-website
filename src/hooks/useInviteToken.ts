import { useRouter } from "next/router";
import { useEffect } from "react";

import { usePostV2ProjectsInviteAccept } from "@/generated/apiComponents";

export const INVITE_TOKEN_KEY = "invite-token";

export const useSetInviteToken = () => {
  const router = useRouter();
  const inviteToken = router.query[INVITE_TOKEN_KEY];

  useEffect(() => {
    if (typeof inviteToken === "string") {
      localStorage.setItem(INVITE_TOKEN_KEY, inviteToken);
    }
  }, [inviteToken]);
};

export const useAcceptInvitation = () => {
  const { mutate } = usePostV2ProjectsInviteAccept({
    onSuccess() {
      localStorage.removeItem(INVITE_TOKEN_KEY);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem(INVITE_TOKEN_KEY);
    if (token) {
      mutate({ body: { token } });
    }
  }, [mutate]);
};
