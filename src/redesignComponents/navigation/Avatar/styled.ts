import styled from "@emotion/styled";

import { getThemedColor } from "../../../lib/theme";

export const StyledAvatarWrapper = styled.div`
  display: inline-block;
  border-radius: 50%;
  width: fit-content;
  height: fit-content;
  border: 0.0625rem solid ${getThemedColor("primary", 800)};

  & div:has(> div > p[aria-label*="unread"]) {
    left: 60% !important;
  }

  & p {
    font-size: 0.75rem !important; /* 12px */
    font-weight: 500 !important;
  }

  &.avatar-add {
    border: 0.0625rem solid ${getThemedColor("neutral", 500)};
    background-color: ${getThemedColor("neutral", 200)} !important;
  }

  > div:first-child {
    border-radius: 50%;
    border: 0.0625rem solid ${getThemedColor("neutral", 100)};
    background-color: ${getThemedColor("primary", 300)};
  }

  &.avatar-small [data-scope="avatar"][data-part="fallback"] {
    font-size: 0.75rem !important; /* 12px */
  }

  &.avatar-medium [data-scope="avatar"][data-part="fallback"] {
    font-size: 1rem !important; /* 16px */
  }

  /* Add variant styles */
  &.avatar-add {
    transition: opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    &:hover:not(:disabled) {
      opacity: 0.8;
    }

    &:focus-visible {
      outline: 0.125rem solid ${getThemedColor("primary", 700)};
      outline-offset: 0.125rem;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }
  }
`;
