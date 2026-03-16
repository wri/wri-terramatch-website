import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { acceptProjectInviteByToken } from "@/connections/UserAssociation";

export const INVITE_TOKEN_KEY = "invite-token";

/**
 * To set monitoring partner invite token in local storage
 */
export const useSetInviteToken = () => {
  const router = useRouter();
  const inviteToken = router.query[INVITE_TOKEN_KEY];

  useEffect(() => {
    if (typeof inviteToken === "string") {
      localStorage.setItem(INVITE_TOKEN_KEY, inviteToken);
    }
  }, [inviteToken]);
};

/**
 * To accept invitation using v3 acceptProjectInvite endpoint
 */
export const useAcceptInvitation = () => {
  const hasAccepted = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem(INVITE_TOKEN_KEY);
    if (token != null && !hasAccepted.current) {
      hasAccepted.current = true;
      acceptProjectInviteByToken(token)
        .then(() => {
          localStorage.removeItem(INVITE_TOKEN_KEY);
        })
        .catch(() => {
          hasAccepted.current = false;
        });
    }
  }, []);
};
